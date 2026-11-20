'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, X } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import {
  describeOutcome,
  useConfirmReconciliation,
  useRequeryPayment,
} from '@/app/_module/services/reconciliation.service';
import type { OrderListItemDto } from '@/app/_module/api/types';

/**
 * Resolve "I paid but I have no ticket" for one order.
 *  1. Check with gateway — re-queries by order reference (no id needed).
 *  2. Confirm with the gateway's transaction ID (from the ALATPay/Monnify
 *     dashboard). For unpaid orders the server also checks the transaction
 *     belongs to THIS order; for cancelled (expired) orders it confirms the
 *     transaction and we verify the reference that comes back.
 * Either way the payment is re-verified with the gateway — nothing is marked
 * paid on the admin's word alone.
 */
interface ResolvePaymentModalProps {
  order: OrderListItemDto | null;
  onClose: () => void;
}

type Result = { ok: boolean; message: string } | null;

export default function ResolvePaymentModal({
  order,
  onClose,
}: ResolvePaymentModalProps) {
  const [transactionId, setTransactionId] = useState('');
  const [result, setResult] = useState<Result>(null);
  const requery = useRequeryPayment();
  const confirm = useConfirmReconciliation();

  useEffect(() => {
    // Prefill the id the checkout reported (bank transfers), so resolving is
    // usually one click. Free orders carry a synthetic FREE-… ref; skip it.
    const reported = order?.transactionRef;
    setTransactionId(reported && !reported.startsWith('FREE-') ? reported : '');
    setResult(null);
  }, [order?.id, order?.transactionRef]);

  if (!order) return null;

  const busy = requery.isPending || confirm.isPending;
  const awaiting = order.status === 'AWAITING_PAYMENT';
  const gatewayHint =
    order.paymentProvider === 'MONNIFY'
      ? 'Monnify dashboard (the transaction reference, e.g. MNFY|…).'
      : 'ALATPay dashboard (Transaction Details → “ID”).';

  const fail = (err: Error) =>
    setResult({
      ok: false,
      message: err.message || 'Could not reach the gateway',
    });

  const checkWithGateway = () => {
    setResult(null);
    requery.mutate(
      { reference: order.reference },
      {
        onSuccess: (res) =>
          setResult(
            res.status === 'PAID'
              ? {
                  ok: true,
                  message: 'Payment confirmed — ticket issued and emailed.',
                }
              : {
                  ok: false,
                  message: `${describeOutcome(res.outcome)}. If the gateway dashboard shows it as successful, paste its transaction ID below.`,
                }
          ),
        onError: fail,
      }
    );
  };

  const confirmById = () => {
    const id = transactionId.trim();
    if (!id) return;
    setResult(null);
    if (awaiting) {
      requery.mutate(
        { reference: order.reference, transactionRef: id },
        {
          onSuccess: (res) =>
            setResult(
              res.status === 'PAID'
                ? {
                    ok: true,
                    message: 'Payment confirmed — ticket issued and emailed.',
                  }
                : { ok: false, message: describeOutcome(res.outcome) }
            ),
          onError: fail,
        }
      );
      return;
    }
    confirm.mutate(id, {
      onSuccess: (res) => {
        if (res.reference && res.reference !== order.reference) {
          setResult({
            ok: false,
            message: `That transaction belongs to ${res.reference}, not this order.`,
          });
          return;
        }
        setResult(
          res.orderStatus === 'PAID'
            ? {
                ok: true,
                message: 'Payment confirmed — ticket issued and emailed.',
              }
            : {
                ok: false,
                message: `${describeOutcome(res.outcome, res.reason)}${
                  res.orderStatus
                    ? ` — order is ${res.orderStatus.replace(/_/g, ' ').toLowerCase()}`
                    : ''
                }`,
              }
        );
      },
      onError: fail,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={busy ? undefined : onClose}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h2 className="text-[16px] font-bold text-gray-900">
            Resolve payment
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-gray-500 hover:bg-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-5 px-6 py-5">
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-[13px]">
            <p className="font-semibold text-gray-900">
              {order.attendeeFullName}
            </p>
            <p className="text-gray-500">{order.attendeeEmail}</p>
            <p className="mt-1 text-gray-700">
              <span className="font-mono">{order.reference}</span> ·{' '}
              {order.ticket?.name ?? '—'} · ₦
              {parseFloat(order.amount).toLocaleString('en-NG')} ·{' '}
              <span className="font-medium text-[#92400E]">
                {order.status.replace(/_/g, ' ').toLowerCase()}
              </span>
            </p>
          </div>

          {awaiting && (
            <div>
              <p className="mb-2 text-[13px] text-gray-700">
                <span className="font-semibold">1.</span> Ask the payment
                gateway whether this order was paid.
              </p>
              <button
                type="button"
                onClick={checkWithGateway}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
              >
                {requery.isPending && !transactionId.trim() && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                Check with gateway
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              confirmById();
            }}
          >
            <p className="mb-2 text-[13px] text-gray-700">
              {awaiting && <span className="font-semibold">2. </span>}
              Paste the <span className="font-semibold">
                transaction ID
              </span>{' '}
              from the {gatewayHint}
            </p>
            <div className="flex gap-2">
              <input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="75e69d88-9701-45a3-825d-…"
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 rounded-md border border-gray-200 px-3 py-2 font-mono text-[12px] focus:outline-none focus:ring-2 focus:ring-black/10"
              />
              <button
                type="submit"
                disabled={busy || !transactionId.trim()}
                className="inline-flex items-center gap-2 rounded-md bg-[#34A853] px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
              >
                {busy && !!transactionId.trim() && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                Confirm payment
              </button>
            </div>
          </form>

          {result && (
            <div
              role="status"
              className={cn(
                'flex items-start gap-2 rounded-lg px-4 py-3 text-[13px]',
                result.ok
                  ? 'bg-[#E8F5E9] text-[#1B873B]'
                  : 'bg-[#FEF3C7] text-[#92400E]'
              )}
            >
              {result.ok && (
                <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
              )}
              <span>{result.message}</span>
            </div>
          )}

          {result?.ok && (
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-gray-900 py-3 text-[14px] font-semibold text-white"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
