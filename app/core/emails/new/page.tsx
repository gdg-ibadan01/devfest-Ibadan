import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import CampaignEditor from '../_components/CampaignEditor';

export default function NewEmailPage() {
  return (
    <AdminWrapper title="New email">
      <CampaignEditor />
    </AdminWrapper>
  );
}
