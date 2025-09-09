'use client';

import { usePathname } from 'next/navigation';
import DFIHeader from '../common/DFIheader';
import DFIFooter from '../common/DFIfooter';

const hideOnRoutes = ['/ticket'];

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideUI = hideOnRoutes.includes(pathname);

  return (
    <>
      {!hideUI && <DFIHeader />}
      {children}
      {!hideUI && <DFIFooter />}
    </>
  );
}
