'use client';

import Link from 'next/link';
import { Loader2, Plus, MailWarning } from 'lucide-react';
import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import {
  useEmailCampaigns,
  useResendUnconfirmedTickets,
  useTicketEmailSummary,
} from '@/app/_module/services';
import CampaignStatusBadge from './CampaignStatusBadge';

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** How many paid/free tickets have a confirmed ticket email, with a bulk resend. */
function TicketEmailHealth() {
  const { data } = useTicketEmailSummary();
  const resend = useResendUnconfirmedTickets();
  if (!data) return null;

  const needsAttention = data.unconfirmed > 0;
  return (
    <div className="mb-[20px] flex flex-col gap-[12px] rounded-xl border border-gray-200 bg-white p-[16px] md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-[12px]">
        <MailWarning
          size={20}
          className={needsAttention ? 'text-amber-600' : 'text-green-600'}
        />
        <div>
          <p className="text-[14px] font-semibold text-[#1e1e1e]">
            Ticket confirmation emails
          </p>
          <p className="text-[13px] text-gray-600">
            {data.sent.toLocaleString()} confirmed sent
            {data.failed > 0 && ` · ${data.failed.toLocaleString()} failed`}
            {data.pending > 0 && ` · ${data.pending.toLocaleString()} waiting`}
            {data.unknown > 0 &&
              ` · ${data.unknown.toLocaleString()} unknown (before tracking)`}
          </p>
          {(data.pending > 0 || data.failed > 0) && (
            <p className="mt-[2px] text-[12px] text-gray-500">
              Waiting and failed emails are retried automatically every few
              minutes (failed ones up to 5 times), within your mail limit.
            </p>
          )}
        </div>
      </div>
      {needsAttention && (
        <button
          type="button"
          disabled={resend.isPending}
          onClick={() => {
            if (
              window.confirm(
                `Re-send the ticket email to up to 100 of the ${data.unconfirmed.toLocaleString()} unconfirmed ticket holders?\n\nPeople who already received theirs (older orders marked "unknown") will get a second copy.`
              )
            ) {
              resend.mutate();
            }
          }}
          className="inline-flex h-[40px] items-center justify-center gap-[8px] rounded-lg border border-gray-300 px-[16px] text-[13px] font-medium hover:bg-gray-50 disabled:opacity-60"
        >
          {resend.isPending && <Loader2 size={14} className="animate-spin" />}
          Resend to unconfirmed
        </button>
      )}
    </div>
  );
}

export default function EmailsPageClient() {
  const { data: campaigns, isLoading, isError } = useEmailCampaigns();

  return (
    <AdminWrapper title="Emails">
      <div className="px-[20px] py-[24px] lg:px-[32px]">
        <TicketEmailHealth />

        <div className="mb-[16px] flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#1e1e1e]">
            Emails to ticket holders
          </h2>
          <Link
            href="/core/emails/new"
            className="inline-flex h-[40px] items-center gap-[8px] rounded-lg bg-[#1e1e1e] px-[16px] text-[13px] font-medium text-white hover:bg-black/80"
          >
            <Plus size={15} /> Compose
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          {isLoading ? (
            <div className="flex h-[160px] items-center justify-center">
              <Loader2 className="animate-spin text-gray-400" />
            </div>
          ) : isError ? (
            <p className="p-[24px] text-[14px] text-red-600">
              Could not load emails.
            </p>
          ) : !campaigns || campaigns.length === 0 ? (
            <div className="px-[24px] py-[48px] text-center">
              <p className="text-[14px] font-semibold text-gray-700">
                No emails yet
              </p>
              <p className="mt-[4px] text-[13px] text-gray-500">
                Compose an email, save it as a draft and send it to your ticket
                holders.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[640px] text-left text-[13px]">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-[16px] py-[12px] font-medium">Subject</th>
                  <th className="px-[16px] py-[12px] font-medium">Status</th>
                  <th className="px-[16px] py-[12px] font-medium">Delivered</th>
                  <th className="px-[16px] py-[12px] font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-[16px] py-[12px]">
                      <Link
                        href={`/core/emails/${c.id}`}
                        className="font-medium text-[#1e1e1e] hover:underline"
                      >
                        {c.subject}
                      </Link>
                    </td>
                    <td className="px-[16px] py-[12px]">
                      <CampaignStatusBadge status={c.status} />
                    </td>
                    <td className="px-[16px] py-[12px] text-gray-600">
                      {c.status === 'DRAFT'
                        ? '—'
                        : `${c.stats.sent.toLocaleString()} / ${c.stats.total.toLocaleString()}${
                            c.stats.failed ? ` (${c.stats.failed} failed)` : ''
                          }`}
                    </td>
                    <td className="px-[16px] py-[12px] text-gray-600">
                      {formatDate(c.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminWrapper>
  );
}
