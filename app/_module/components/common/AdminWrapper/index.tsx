import { ReactNode } from 'react';
import { adminWrapperClass as styles } from './AdminWrapper.classes';
import AdminNotificationBell from '../../icons/AdminNotificationBell';

interface AdminHeaderWrapperProps {
  children: ReactNode;
  title: string;
}

const AdminWrapper = ({ children, title }: AdminHeaderWrapperProps) => {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <header className="border-b border-[#dedede] py-5 flex items-center justify-between px-6 h-[81px] bg-white border-l border-[#dedede]">
          <h1 className="text-[25px] font-bold leading-tight text-[#1e1e1e]">
            {title}
          </h1>
          <AdminNotificationBell />
        </header>
        {children}
      </main>
    </div>
  );
};

export default AdminWrapper;
