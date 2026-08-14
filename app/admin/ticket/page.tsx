import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import TicketTable from './_components/TicketTable';

export default function TicketsPage() {
  return (
    <AdminWrapper title="Ticket">
      <div className="px-[32px] py-[24px]">
        <TicketTable />
      </div>
    </AdminWrapper>
  );
}
