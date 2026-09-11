import type { Metadata } from 'next';
import './globals.css';
import RootLayout from './layouts';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Devfest Ibadan 2026',
  description:
    'Join DevFest Ibadan 2026 on 21 November at Kakanfo Inn & Conference Centre for talks, workshops, codelabs and networking.',
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootLayout>
      <Toaster position="top-center" />
      {children}
    </RootLayout>
  );
}
