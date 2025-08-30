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
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
      <div
        className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"
        style={{ animationDelay: '0.1s' }}
      ></div>
      <div
        className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"
        style={{ animationDelay: '0.2s' }}
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
                <Toaster
                  richColors
                  position={'top-right'}
                  duration={5000}
                />
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
  // Define routes where you want to hide the header/footer
  const hideUIRoutes = ['/ticket'];
  const hideUI = hideUIRoutes.includes(pathname);
  // Define the route where you want to hide the footer
  const hideFooterRoutes = ['/schedule'];
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
                {!hideUI && <DFIHeader />}
                {children}
                {!hideUI && !shouldHideFooter && <DFIFooter />}
                <Toaster
                  richColors
                  position={'top-right'}
                  duration={5000}
                />
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
