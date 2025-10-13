'use client';

import { AdminAuthWrapper } from '../components/auth/AdminAuthWrapper';

export default function AdminPaymentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthWrapper>{children}</AdminAuthWrapper>;
}
