'use client';

import DFIHeader from './_module/components/common/DFIheader';
import DFIFooter from './_module/components/common/DFIfooter';
import { google_sans } from './shared/font';
import { ReactLenis } from '@/utils/lenis';
import { Toaster } from 'sonner';
import { usePathname } from 'next/navigation';
import AdminSidenav from './_module/components/common/AdminSidenav';
import { SidenavProvider } from './_module/context/SidenavContext';
import { Fragment, Suspense } from 'react';
import ReactQueryProvider from '@/providers/react-query';
import { ErrorBoundary } from '@/providers/error-boundary';
import AuthGuard from './_module/components/common/AuthGuard';

export const wrapperClass = {
  layout:
    'min-h-screen bg-[#f7f7f7] text-[#1e1e1e] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]',
  main: 'min-w-0 bg-[#fafafa]',
};

// Loading component for Suspense fallback
export const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
    <div className="flex items-center space-x-3">
      <div className="w-5 h-5 bg-core-blue rounded-full animate-bounce"></div>
      <div
        className="w-5 h-5 bg-core-blue rounded-full animate-bounce"
        style={{ animationDelay: '0.2s' }}
      ></div>
      <div
        className="w-5 h-5 bg-core-blue rounded-full animate-bounce"
        style={{ animationDelay: '0.4s' }}
      ></div>
    </div>
  </div>
);

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      {/* <ReactLenis root> */}
      <body className={`${google_sans.className}`}>
        <ReactQueryProvider>
          <ErrorBoundary
            fallbackMessage="Something went wrong with the admin panel. Please refresh and try again."
            showErrorDetails={process.env.NODE_ENV === 'development'}
          >
            <Suspense fallback={<PageLoader />}>
              {/* <AdminHeader /> */}
              <SidenavProvider>
                  <div className={wrapperClass.layout}>
                    <AdminSidenav />
                    <main className={wrapperClass.main}>
                      <AuthGuard>{children}</AuthGuard>
                    </main>
                  </div>
                </SidenavProvider>
              <Toaster position='top-center' duration={4000} />
            </Suspense>
          </ErrorBoundary>
        </ReactQueryProvider>
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
  const pathname = usePathname();
  // Define routes where you want to hide the header
  const hideHeaderRoutes: string[] = [];
  const shouldHideHeader = hideHeaderRoutes.includes(pathname);
  // Define the route where you want to hide the footer
  const hideFooterRoutes = [
    '/rsvp',
    '/ticket/buy',
    '/ticket/gift',
    '/ticket/preview',
  ];
  const shouldHideFooter = hideFooterRoutes.includes(pathname);
  return (
    <html lang="en">
      <ReactLenis root>
        <body className={`${google_sans.className}`}>
          <ReactQueryProvider>
            <ErrorBoundary
              fallbackMessage="We're having trouble loading the page. Please refresh and try again."
              showErrorDetails={process.env.NODE_ENV === 'development'}
            >
              <Suspense fallback={<PageLoader />}>
                {!shouldHideHeader && <DFIHeader />}
                {children}
                {!shouldHideHeader && !shouldHideFooter && <DFIFooter />}
                <Toaster position='top-center' duration={4000} />
              </Suspense>
            </ErrorBoundary>
          </ReactQueryProvider>
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
  // Define the layout to be displayed based on the current route
  const adminRoute = '/admin';
  const pathname = usePathname();

  // Auth pages (/admin sign-in *) use HomeLayout — no sidenav
  const isAdminSignIn = pathname === '/admin';
  const isAdminDashboard = pathname.startsWith(adminRoute) && !isAdminSignIn;

  return (
    <Fragment>
      {isAdminDashboard ? (
        <AdminLayout>{children}</AdminLayout>
      ) : (
        <HomeLayout>{children}</HomeLayout>
      )}
    </Fragment>
  );
}
