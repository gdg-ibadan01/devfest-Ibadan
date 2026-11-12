import { cn } from '@/app/_module/lib/utils';
import type {
  EmailCampaignStatus,
  EmailSendStatus,
} from '@/app/_module/api/types';

const STYLES: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  SENDING: 'bg-blue-50 text-blue-700',
  SENT: 'bg-green-50 text-green-700',
  PARTIAL: 'bg-amber-50 text-amber-700',
  FAILED: 'bg-red-50 text-red-700',
  PENDING: 'bg-amber-50 text-amber-700',
};

const LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  SENDING: 'Sending',
  SENT: 'Sent',
  PARTIAL: 'Partly sent',
  FAILED: 'Failed',
  PENDING: 'Waiting',
};

export default function CampaignStatusBadge({
  status,
}: {
  status: EmailCampaignStatus | EmailSendStatus;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-[10px] py-[2px] text-[12px] font-medium',
        STYLES[status]
      )}
    >
      {LABELS[status]}
    </span>
  );
}
