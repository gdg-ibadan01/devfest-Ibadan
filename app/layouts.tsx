'use client';

import DFIHeader from './_module/components/common/DFIheader';
import DFIFooter from './_module/components/common/DFIfooter';
import { google_sans } from './shared/font';
import { ReactLenis } from '@/utils/lenis';
import { Toaster } from 'sonner';
import { usePathname } from 'next/navigation';
import { Fragment, Suspense } from 'react';
import AdminHeader from './_module/components/common/AdminHeader';
import ReactQueryProvider from '@/providers/react-query';
import { ErrorBoundary } from '@/providers/error-boundary';

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
      <ReactLenis root>
        <body className={`${google_sans.className}`}>
          <ReactQueryProvider>
            <ErrorBoundary
              fallbackMessage="Something went wrong with the admin panel. Please refresh and try again."
              showErrorDetails={process.env.NODE_ENV === 'development'}
            >
              <Suspense fallback={<PageLoader />}>
                <AdminHeader />
                {children}
                <Toaster richColors position={'top-right'} duration={6000} />
              </Suspense>
            </ErrorBoundary>
          </ReactQueryProvider>
        </body>
      </ReactLenis>
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
  const hideHeaderRoutes = ['/ticket'];
  const shouldHideHeader = hideHeaderRoutes.includes(pathname);
  // Define the route where you want to hide the footer
  const hideFooterRoutes = ['/ticket', '/rsvp'];
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
                <Toaster richColors position={'top-right'} duration={6000} />
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

  return (
    <Fragment>
      {pathname.startsWith(adminRoute) ? (
        <AdminLayout>{children}</AdminLayout>
      ) : (
        <HomeLayout>{children}</HomeLayout>
      )}
    </Fragment>
  );
}
