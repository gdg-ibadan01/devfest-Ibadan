import { ReactNode } from 'react';
import AdminSidenav from '../AdminSidenav';
import { adminHeaderWrapperClass as styles } from './AdminHeaderWrapper.classes';

interface AdminHeaderWrapperProps {
  children: ReactNode;
}

const AdminHeaderWrapper = ({ children }: AdminHeaderWrapperProps) => {
  return (
    <div className={styles.layout}>
      <AdminSidenav />
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default AdminHeaderWrapper;
