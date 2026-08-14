import AdminSidebar from '@/app/_module/components/admin/AdminSidebar';
import AdminTopBar from '@/app/_module/components/admin/AdminTopBar';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto bg-[#F5F5F5]">{children}</main>
      </div>
    </div>
  );
}
