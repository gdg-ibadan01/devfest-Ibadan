'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Loader2, RotateCw } from 'lucide-react';
import { apiClient } from '@/app/_module/api/client';
import { notifyApiError } from '@/app/_module/lib/apiError';
import { showToast } from '@/app/_module/lib/notify';
import {
  useCampaignDeliveries,
  useRetryFailedDeliveries,
} from '@/app/_module/services';
import type {
  EmailCampaignDto,
  EmailDeliveriesResponse,
} from '@/app/_module/api/types';
import { downloadContactsCsv, zipNotice } from '@/utils/contacts-csv';
import CampaignStatusBadge from './CampaignStatusBadge';

const PAGE_SIZE = 20;
const FILTERS = [
  { value: '', label: 'All' },
  { value: 'SENT', label: 'Sent' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'PENDING', label: 'Waiting' },
];

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-[16px] py-[12px]">
      <p className="text-[12px] text-gray-500">{label}</p>
      <p className="text-[20px] font-semibold">{value.toLocaleString()}</p>
    </div>
  );
}

/** Delivery report for a campaign that has been sent (or is sending). */
export default function CampaignDetail({
  campaign,
}: {
  campaign: EmailCampaignDto;
}) {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  const sending = campaign.status === 'SENDING';
  const { data, isFetching } = useCampaignDeliveries(
    campaign.id,
    { status: status || undefined, page, limit: PAGE_SIZE },
    { refetch: sending }
  );
  const retry = useRetryFailedDeliveries();

  const { stats } = campaign;
  const done = stats.sent + stats.failed;
  const pct = stats.total ? Math.round((done / stats.total) * 100) : 0;
  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  const exportFailed = async () => {
    setExporting(true);
    try {
      const rows: { email: string; fullName: string }[] = [];
      for (let p = 1; ; p++) {
        const { data: res } = await apiClient.get<EmailDeliveriesResponse>(
          `/email-campaigns/${campaign.id}/deliveries`,
          { params: { status: 'FAILED', page: p, limit: 100 } }
        );
        rows.push(...res.data);
        if (rows.length >= res.total || res.data.length === 0) break;
      }
      if (rows.length === 0) {
        showToast.info('No failed emails to export');
        return;
      }
      const result = await downloadContactsCsv(
        rows,
        `email-failed-${campaign.id.slice(0, 8)}.csv`
      );
      const notice = zipNotice(result);
      if (notice) showToast.info(notice);
    } catch (error) {
      notifyApiError(error, 'Failed to export');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-[20px] px-[20px] py-[24px] lg:px-[32px]">
      <Link
        href="/core/emails"
        className="inline-flex items-center gap-[6px] text-[13px] text-gray-600 hover:underline"
      >
        <ArrowLeft size={14} /> All emails
      </Link>

      <div className="flex flex-wrap items-center gap-[12px]">
        <h2 className="text-[20px] font-semibold">{campaign.subject}</h2>
        <CampaignStatusBadge status={campaign.status} />
      </div>
      {campaign.preheader && (
        <p className="-mt-[8px] text-[13px] text-gray-500">
          {campaign.preheader}
        </p>
      )}

      <div className="grid grid-cols-2 gap-[12px] md:grid-cols-4">
        <Stat label="Recipients" value={stats.total} />
        <Stat label="Sent" value={stats.sent} />
        <Stat label="Failed" value={stats.failed} />
        <Stat label="Waiting" value={stats.pending} />
      </div>

      {(sending || stats.pending > 0) && (
        <div>
          <div className="h-[8px] w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-[6px] text-[12px] text-gray-500">
            {pct}% done.{' '}
            {sending
              ? 'Emails are sent in the background within your mail provider’s limits, so a big list can take a while (or more than a day on a daily cap). You can leave this page.'
              : ''}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-[10px]">
        {stats.failed > 0 && (
          <>
            <button
              type="button"
              disabled={retry.isPending || sending}
              onClick={() => retry.mutate(campaign.id)}
              className="inline-flex h-[40px] items-center gap-[8px] rounded-lg bg-[#1e1e1e] px-[16px] text-[13px] font-medium text-white hover:bg-black/80 disabled:opacity-50"
            >
              {retry.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RotateCw size={14} />
              )}
              Retry {stats.failed.toLocaleString()} failed
            </button>
            <button
              type="button"
              disabled={exporting}
              onClick={exportFailed}
              className="inline-flex h-[40px] items-center gap-[8px] rounded-lg border border-gray-300 px-[16px] text-[13px] font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              {exporting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              Export failed as CSV
            </button>
          </>
        )}
      </div>

      <div>
        <div className="mb-[10px] flex flex-wrap gap-[6px]">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                setStatus(f.value);
                setPage(1);
              }}
              className={`rounded-full border px-[12px] py-[4px] text-[12px] ${
                status === f.value
                  ? 'border-[#1e1e1e] bg-[#1e1e1e] text-white'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
          {isFetching && (
            <Loader2
              size={14}
              className="ml-[6px] animate-spin text-gray-400"
            />
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="border-b border-gray-200 bg-gray-50 text-gray-500">
              <tr>
                <th className="px-[16px] py-[12px] font-medium">Name</th>
                <th className="px-[16px] py-[12px] font-medium">Email</th>
                <th className="px-[16px] py-[12px] font-medium">Status</th>
                <th className="px-[16px] py-[12px] font-medium">Detail</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data ?? []).map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-[16px] py-[10px]">{d.fullName}</td>
                  <td className="px-[16px] py-[10px]">{d.email}</td>
                  <td className="px-[16px] py-[10px]">
                    <CampaignStatusBadge status={d.status} />
                    {d.status === 'SENT' && d.event && (
                      <span
                        className={
                          d.event === 'BOUNCED' || d.event === 'COMPLAINED'
                            ? 'ml-[6px] rounded-full bg-red-50 px-[10px] py-[2px] text-[12px] font-medium text-red-700'
                            : 'ml-[6px] rounded-full bg-green-50 px-[10px] py-[2px] text-[12px] font-medium text-green-700'
                        }
                      >
                        {
                          {
                            DELIVERED: 'Delivered',
                            DELAYED: 'Delayed',
                            BOUNCED: 'Bounced',
                            COMPLAINED: 'Marked spam',
                          }[d.event]
                        }
                      </span>
                    )}
                  </td>
                  <td className="max-w-[320px] truncate px-[16px] py-[10px] text-gray-500">
                    {d.status === 'FAILED'
                      ? d.error
                      : d.event === 'BOUNCED' || d.event === 'COMPLAINED'
                        ? d.eventDetail
                        : d.sentAt
                          ? new Date(d.sentAt).toLocaleString('en-NG')
                          : ''}
                  </td>
                </tr>
              ))}
              {data && data.data.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-[16px] py-[32px] text-center text-gray-500"
                  >
                    Nothing here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data && data.total > PAGE_SIZE && (
          <div className="mt-[10px] flex items-center justify-between text-[13px]">
            <span className="text-gray-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-[8px]">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-gray-300 px-[12px] py-[6px] disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-gray-300 px-[12px] py-[6px] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
