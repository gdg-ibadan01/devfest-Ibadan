'use client';

import { Loader2 } from 'lucide-react';
import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import { useEmailCampaign } from '@/app/_module/services';
import CampaignEditor from './CampaignEditor';
import CampaignDetail from './CampaignDetail';

/** A draft opens in the composer; anything already sent opens its delivery report. */
export default function CampaignPageClient({ id }: { id: string }) {
  const { data: campaign, isLoading, isError } = useEmailCampaign(id);

  return (
    <AdminWrapper title={campaign?.status === 'DRAFT' ? 'Edit draft' : 'Email'}>
      {isLoading ? (
        <div className="flex h-[240px] items-center justify-center">
          <Loader2 className="animate-spin text-gray-400" />
        </div>
      ) : isError || !campaign ? (
        <p className="p-[32px] text-[14px] text-red-600">
          Could not load this email.
        </p>
      ) : campaign.status === 'DRAFT' ? (
        <CampaignEditor key={campaign.id} campaign={campaign} />
      ) : (
        <CampaignDetail campaign={campaign} />
      )}
    </AdminWrapper>
  );
}
