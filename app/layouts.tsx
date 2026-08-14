'use client';

import DFIHeader from './_module/components/common/DFIheader';
import DFIFooter from './_module/components/common/DFIfooter';
import { google_sans } from './shared/font';
import { ReactLenis } from '@/utils/lenis';
import { Toaster } from 'sonner';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import AdminSidenav from './_module/components/common/AdminSidenav';

export const wrapperClass = {
  layout:
    'min-h-screen bg-[#f7f7f7] text-[#1e1e1e] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]',
  main: 'min-w-0 bg-[#fafafa]',
};

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      {/* <ReactLenis root> */}
        <body className={`${google_sans.className}`}>
          <div className={wrapperClass.layout}>
            <AdminSidenav />
            <main className={wrapperClass.main}>{children}</main>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              closeButton: false,
            }}
            closeButton={false}
          />
        </body>
      {/* </ReactLenis> */}
    </html>
  );
};

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const hideFooterRoutes = ['/schedule'];
  return (
    <html lang="en">
      <ReactLenis root>
        <body className={`${google_sans.className}`}>
          <DFIHeader />
          {children}
          <DFIFooter />
        </body>
      </ReactLenis>
    </html>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adminRoute = '/admin';
  const pathname = usePathname();
  return (
    <Fragment>
      {pathname.includes(adminRoute) ? (
        <AdminLayout>{children}</AdminLayout>
      ) : (
        <HomeLayout>{children}</HomeLayout>
      )}
    </Fragment>
  );
}
