'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, ScanLine, Search, X } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import { useOrders } from '@/app/_module/services/order.service';
import {
  useCheckInAttendee,
  useUndoCheckIn,
} from '@/app/_module/services/attendees.service';
import {
  eventDayKey,
  eventToday,
  formatEventTime,
} from '@/app/_module/lib/eventDate';
import type { OrderListItemDto } from '@/app/_module/api/types';

/**
 * Door-side check-in: type the 6-character ticket code (or a name/email),
 * press Enter, tap Check In. The input refocuses after each check-in so the
 * next attendee can be processed without touching the mouse.
 */
export default function QuickCheckIn() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');

  const { data, isFetching, isError } = useOrders(
    { search: query, limit: 6 },
    { enabled: query.length >= 2 }
  );
  const { mutate: checkIn, isPending, variables } = useCheckInAttendee();
  const undo = useUndoCheckIn();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = query.length >= 2 ? (data?.data ?? []) : [];
  const today = eventToday();

  const submit = () => {
    const q = input.trim();
    if (q.length < 2) return;
    setQuery(q);
  };

  const reset = () => {
    setInput('');
    setQuery('');
    inputRef.current?.focus();
  };

  const handleCheckIn = (order: OrderListItemDto) =>
    checkIn(
      { orderId: order.id },
      {
        onSuccess: () => {
          // Single exact match → clear for the next person in the queue.
          if (results.length === 1) reset();
        },
      }
    );

  return (
    <section className="mb-6 rounded-[14px] border border-gray-200 bg-white p-5">
      <div className="mb-3 flex items-center gap-2">
        <ScanLine size={18} className="text-[#4285F4]" />
        <h2 className="text-[15px] font-bold text-[#252525]">Quick check-in</h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="flex min-w-[240px] flex-1 items-center overflow-hidden rounded-md border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-black/10">
          <Search size={15} className="ml-4 flex-shrink-0 text-gray-400" />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ticket code, name or email"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent px-3 py-[12px] text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none"
          />
          {input && (
            <button
              type="button"
              onClick={reset}
              aria-label="Clear"
              className="mr-3 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={input.trim().length < 2}
          className="flex items-center gap-1.5 rounded-md bg-gray-900 px-5 py-[12px] text-[13px] font-medium text-white transition-colors hover:bg-black disabled:opacity-50"
        >
          {isFetching && <Loader2 size={14} className="animate-spin" />}
          Find
        </button>
      </form>

      {query.length >= 2 && (
        <div className="mt-4">
          {isError ? (
            <p className="text-[13px] text-red-400">
              Search failed. Try again.
            </p>
          ) : !isFetching && results.length === 0 ? (
            <p className="text-[13px] text-gray-500">
              No ticket matches “{query}”. Check the code on the attendee&apos;s
              ticket.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100">
              {results.map((order) => {
                const todaysCheckIn = order.checkIns.find(
                  (c) => eventDayKey(c) === today
                );
                const paid = order.status === 'PAID';
                const busy = isPending && variables?.orderId === order.id;
                return (
                  <li
                    key={order.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-gray-900">
                        {order.attendeeFullName}
                      </p>
                      <p className="truncate text-[12px] text-gray-500">
                        {order.attendeeEmail} · {order.ticket?.name ?? '—'} ·{' '}
                        <span className="font-mono">
                          {order.ticket?.code ?? '—'}
                        </span>
                        {order.ticket?.validity
                          ? ` · ${order.ticket.validity}`
                          : ''}
                      </p>
                    </div>
                    {!paid ? (
                      <span className="rounded-full bg-[#FDECEA] px-3 py-1 text-[12px] font-medium text-[#C5221F]">
                        Not paid (
                        {order.status.replace(/_/g, ' ').toLowerCase()})
                      </span>
                    ) : todaysCheckIn ? (
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-[12px] font-medium text-[#92400E]">
                          Already in · {formatEventTime(todaysCheckIn)}
                        </span>
                        <button
                          type="button"
                          onClick={() => undo.mutate({ orderId: order.id })}
                          disabled={
                            undo.isPending &&
                            undo.variables?.orderId === order.id
                          }
                          className="text-[12px] font-medium text-[#C5221F] hover:underline disabled:opacity-50"
                        >
                          Undo
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCheckIn(order)}
                        disabled={busy}
                        className={cn(
                          'flex items-center gap-1.5 rounded-md bg-[#34A853] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#2C8E46] disabled:opacity-60'
                        )}
                      >
                        {busy && <Loader2 size={14} className="animate-spin" />}
                        Check in
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
