'use client';

import { usePathname } from 'next/navigation';
import DFIHeader from '../common/DFIheader';
import DFIFooter from '../common/DFIfooter';

const hideOnRoutes = new Set(['/tickets']);

export default function LayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideUI = hideOnRoutes.has(pathname);

  return (
    <>
      {!hideUI && <DFIHeader />}
      {children}
      {!hideUI && <DFIFooter />}
    </>
  );
}
