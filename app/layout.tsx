import type { Metadata } from 'next';
import './globals.css';
import RootLayout from './layouts';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Devfest Ibadan 2026',
  description: 'The Biggest GDG Event in Ibadan',
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
