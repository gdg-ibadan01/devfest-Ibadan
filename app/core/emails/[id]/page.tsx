import CampaignPageClient from '../_components/CampaignPageClient';

export default function EmailCampaignPage({
  params,
}: {
  params: { id: string };
}) {
  return <CampaignPageClient id={params.id} />;
}
