import StatCard from './_components/StatCard';
import RegistrationTrendChart from './_components/RegistrationTrendChart';
import TicketBreakdownChart from './_components/TicketBreakdownChart';
import RecentAttendeesTable from './_components/RecentAttendeesTable';

export default function AdminHomePage() {
  return (
    <div className="px-8 py-8">

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Attendees" value="1,247" bgClass="bg-pastel-blue" />
        <StatCard label="Tickets Sold" value="892" bgClass="bg-pastel-green" />
        <StatCard label="Revenue" value="₦4,250,000" bgClass="bg-pastel-yellow" />
        <StatCard label="Days to Event" value="15" bgClass="bg-halftone-red" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-5 gap-5 mb-8">
        <div className="col-span-3">
          <RegistrationTrendChart />
        </div>
        <div className="col-span-2">
          <TicketBreakdownChart />
        </div>
      </div>

      {/* Recent Attendees */}
      <div>
        <h2 className="text-[18px] font-semibold text-black mb-4">
          Recent Attendees
        </h2>
        <RecentAttendeesTable />
      </div>
    </div>
  );
}
