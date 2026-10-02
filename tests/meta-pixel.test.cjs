const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = ts.transpileModule(readFileSync('utils/meta-pixel.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function setup({ ready = true, blockedStorage = false, storage = new Map(), pixelId = '123' } = {}) {
  const calls = [];
  const window = {
    sessionStorage: {
      getItem(key) {
        if (blockedStorage) throw new Error('Storage blocked');
        return storage.get(key);
      },
      setItem(key, value) {
        if (blockedStorage) throw new Error('Storage blocked');
        storage.set(key, value);
      },
    },
  };
  if (ready) window.fbq = (...args) => calls.push(args);
  const context = { window, exports: {}, process: { env: { NEXT_PUBLIC_FACEBOOK_PIXEL_ID: pixelId } } };
  vm.runInNewContext(source, context);
  return { api: context.exports, window, calls, storage };
}

const order = { amount: 3000, ticketType: 'Student', quantity: 1, reference: 'order-123' };

test('purchase and registration include Naira amount, ticket, quantity and reference', () => {
  const { api, calls } = setup();
  api.trackPurchase(order);
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), ['Purchase', 'CompleteRegistration'].map(event => [
    'track', event, { value: 3000, currency: 'NGN', content_name: 'Student', num_items: 1 }, { eventID: 'order-123' },
  ]));
});

test('deduplicates rerenders and page reloads while allowing another order', () => {
  const first = setup();
  first.api.trackPurchase(order);
  first.api.trackPurchase(order);
  assert.equal(first.calls.length, 2);
  const reloaded = setup({ storage: first.storage });
  reloaded.api.trackPurchase(order);
  assert.equal(reloaded.calls.length, 0);
  reloaded.api.trackPurchase({ ...order, reference: 'order-456' });
  assert.equal(reloaded.calls.length, 2);
});

test('events before Pixel initialization do not create a stub and flush after init', () => {
  const { api, calls, window } = setup({ ready: false });
  api.trackPurchase(order);
  assert.equal(window.fbq, undefined);
  window.fbq = (...args) => calls.push(args);
  api.flushPixelEvents();
  api.flushPixelEvents();
  assert.equal(calls.length, 2);
});

test('blocked session storage does not break tracking or in-memory deduplication', () => {
  const { api, calls } = setup({ blockedStorage: true });
  api.trackPurchase(order);
  api.trackPurchase(order);
  assert.equal(calls.length, 2);
});

test('rejects invalid amounts/references/quantities without marking a purchase tracked', () => {
  const { api, calls } = setup();
  for (const amount of [NaN, Infinity, -1]) api.trackPurchase({ ...order, amount });
  api.trackPurchase({ ...order, reference: ' ' });
  api.trackPurchase({ ...order, quantity: 0 });
  assert.equal(calls.length, 0);
  api.trackPurchase(order);
  assert.equal(calls.length, 2);
});

test('checkout sends discounted total without purchase events', () => {
  const { api, calls } = setup();
  api.trackInitiateCheckout({ ...order, amount: 2500.5 });
  assert.equal(calls.length, 1);
  assert.equal(calls[0][1], 'InitiateCheckout');
  assert.equal(calls[0][2].value, 2500.5);
  assert.equal(calls[0][2].currency, 'NGN');
  assert.equal(calls[0][2].num_items, 1);
});

test('missing pixel configuration does not record or mark events tracked', () => {
  const { api, calls, storage } = setup({ pixelId: '' });
  api.trackPurchase(order);
  assert.equal(calls.length, 0);
  assert.equal(storage.size, 0);
});

test('success card emits completion events only for backend-confirmed PAID orders', () => {
  const cardSource = ts.transpileModule(
    readFileSync('app/tickets/success/components/SuccessOrderCard.tsx', 'utf8'),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }
  ).outputText;
  for (const status of ['AWAITING_PAYMENT', 'CANCELLED', 'AWAITING_REFUND', 'REFUNDED', 'PAID']) {
    const { api, calls } = setup();
    const context = {
      exports: {},
      require(name) {
        if (name === '@/utils/meta-pixel') return api;
        if (name === 'react') return { useEffect: (effect) => effect() };
        if (name === 'react/jsx-runtime') return { jsx: () => null, jsxs: () => null };
        if (name === 'framer-motion') return { motion: { div: 'div', p: 'p', button: 'button' } };
        return {};
      },
    };
    vm.runInNewContext(cardSource, context);
    context.exports.default({
      order: { status, amount: '3000.00', code: 'ticket-123', ticket: { name: 'Student' } },
      reference: 'order-123',
      onDownload() {},
    });
    assert.equal(calls.length, status === 'PAID' ? 2 : 0, status);
  }
});
