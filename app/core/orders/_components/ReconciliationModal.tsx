'use client';

import { useState } from 'react';
import { Loader2, RefreshCw, X } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import {
  describeOutcome,
  useConfirmReconciliation,
  useReconciliation,
  useRequeryPayment,
} from '@/app/_module/services/reconciliation.service';
import { showToast } from '@/app/_module/lib/notify';
import { formatEventTime, eventDayKey } from '@/app/_module/lib/eventDate';

/**
 * "I paid but I have no ticket". Lists completed ALATPay transactions whose
 * order isn't PAID here, with a one-click confirm, plus a re-check by order
 * reference that works for either gateway.
 */
interface ReconciliationModalProps {
  open: boolean;
  onClose: () => void;
}

const WINDOWS = [2, 6, 12, 24, 48];

function when(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${eventDayKey(d)} ${formatEventTime(d)}`;
}

export default function ReconciliationModal({
  open,
  onClose,
}: ReconciliationModalProps) {
  const [hours, setHours] = useState(6);
  const [reference, setReference] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const { data, isLoading, isFetching, isError, error, refetch } =
    useReconciliation(hours, open);
  const confirm = useConfirmReconciliation();
  const requery = useRequeryPayment();

  if (!open) return null;

  const recheck = () => {
    const ref = reference.trim();
    if (!ref) return;
    requery.mutate(
      { reference: ref },
      {
        onSuccess: (res) => {
          const msg = `${ref}: ${describeOutcome(res.outcome)} — order is ${res.status.replace(/_/g, ' ').toLowerCase()}`;
          if (res.status === 'PAID') showToast.success(msg);
          else
            showToast.warning(
              `${msg}. If ALATPay shows it as Success, paste its transaction ID below and confirm.`,
              { duration: 9000 }
            );
        },
        onError: (err) =>
          showToast.error(err.message || 'Could not re-check payment'),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-[980px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
          <div>
            <h2 className="text-[16px] font-bold text-gray-900">
              Payment issues
            </h2>
            <p className="text-[12px] text-gray-500">
              Paid on ALATPay but not confirmed here. Confirming re-verifies
              with the gateway and issues the ticket.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-gray-500 hover:bg-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-6 py-3">
          <label className="flex items-center gap-2 text-[12px] text-gray-600">
            Last
            <select
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="rounded-md border border-gray-200 px-2 py-1 text-[12px]"
            >
              {WINDOWS.map((h) => (
                <option key={h} value={h}>
                  {h} hours
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1 text-[12px] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />{' '}
            Refresh
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              recheck();
            }}
            className="ml-auto flex items-center gap-2"
          >
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Order reference (any gateway)"
              className="w-[220px] rounded-md border border-gray-200 px-3 py-1.5 text-[12px] focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            <button
              type="submit"
              disabled={!reference.trim() || requery.isPending}
              className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-50"
            >
              {requery.isPending && (
                <Loader2 size={12} className="animate-spin" />
              )}
              Re-check
            </button>
          </form>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const id = transactionId.trim();
            if (!id) return;
            confirm.mutate(id, { onSuccess: () => setTransactionId('') });
          }}
          className="flex flex-wrap items-center gap-2 border-b border-gray-100 bg-[#F8FAFF] px-6 py-3"
        >
          <p className="mr-auto text-[12px] text-gray-600">
            Paid on ALATPay but not listed? Paste the transaction{' '}
            <span className="font-semibold">ID</span> from ALATPay&apos;s
            Transaction Details.
          </p>
          <input
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="e.g. 75e69d88-9701-45a3-825d-…"
            autoComplete="off"
            spellCheck={false}
            className="w-[300px] rounded-md border border-gray-200 px-3 py-1.5 font-mono text-[12px] focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <button
            type="submit"
            disabled={!transactionId.trim() || confirm.isPending}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#34A853] px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-50"
          >
            {confirm.isPending &&
              confirm.variables === transactionId.trim() && (
                <Loader2 size={12} className="animate-spin" />
              )}
            Confirm payment
          </button>
        </form>

        <div className="flex-1 overflow-auto px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-[13px] text-gray-500">
              <Loader2 size={16} className="animate-spin" /> Asking ALATPay for
              recent payments…
            </div>
          ) : isError ? (
            <p className="py-16 text-center text-[13px] text-red-500">
              {(error as Error)?.message ||
                'Could not reach ALATPay. Try again shortly.'}
            </p>
          ) : data && !data.configured ? (
            <p className="py-16 text-center text-[13px] text-gray-500">
              ALATPay isn&apos;t configured on the server, so there is nothing
              to reconcile.
            </p>
          ) : data && data.items.length === 0 ? (
            <p className="py-16 text-center text-[13px] text-gray-500">
              All {data.scanned} completed ALATPay payment
              {data.scanned === 1 ? '' : 's'} in the last {hours} hours match a
              paid order. Nothing to fix.
            </p>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-gray-200 text-left text-[12px] text-gray-600">
                  <th className="py-2 pr-4 font-semibold">Attendee</th>
                  <th className="py-2 pr-4 font-semibold">Order</th>
                  <th className="py-2 pr-4 font-semibold text-right">Paid</th>
                  <th className="py-2 pr-4 font-semibold">Paid at</th>
                  <th className="py-2 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {data?.items.map((item) => {
                  const busy =
                    confirm.isPending &&
                    confirm.variables === item.transactionRef;
                  return (
                    <tr
                      key={item.transactionRef}
                      className="border-b border-gray-100 align-top"
                    >
                      <td className="py-3 pr-4">
                        {item.order ? (
                          <>
                            <p className="font-medium text-gray-900">
                              {item.order.attendeeFullName}
                            </p>
                            <p className="text-[12px] text-gray-500">
                              {item.order.attendeeEmail}
                            </p>
                          </>
                        ) : (
                          <span className="text-gray-500">Unknown</span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        {item.order ? (
                          <>
                            <p className="font-mono text-[12px] text-gray-800">
                              {item.order.reference}
                            </p>
                            <p className="text-[12px] text-gray-500">
                              {item.order.ticketName} ·{' '}
                              <span
                                className={cn(
                                  'font-medium',
                                  item.order.status === 'CANCELLED'
                                    ? 'text-[#C5221F]'
                                    : 'text-[#92400E]'
                                )}
                              >
                                {item.order.status
                                  .replace(/_/g, ' ')
                                  .toLowerCase()}
                              </span>
                            </p>
                          </>
                        ) : (
                          <p className="text-[12px] text-gray-500">
                            No matching order · tx{' '}
                            <span className="font-mono">
                              {item.transactionRef}
                            </span>
                          </p>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-right font-semibold tabular-nums">
                        ₦{item.amount.toLocaleString('en-NG')}
                      </td>
                      <td className="py-3 pr-4 text-gray-600">
                        {when(item.paidAt)}
                      </td>
                      <td className="py-3 text-right">
                        {item.issue === 'ORDER_NOT_PAID' ? (
                          <button
                            type="button"
                            onClick={() => confirm.mutate(item.transactionRef)}
                            disabled={busy}
                            className="inline-flex items-center gap-1.5 rounded-md bg-[#34A853] px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-50"
                          >
                            {busy && (
                              <Loader2 size={12} className="animate-spin" />
                            )}
                            Confirm
                          </button>
                        ) : (
                          <span className="text-[12px] text-gray-400">
                            Check ALATPay dashboard
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
