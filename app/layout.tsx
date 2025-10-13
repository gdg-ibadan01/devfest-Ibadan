import type { Metadata } from 'next';
import './globals.css';
import RootLayout from './layouts';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Devfest Ibadan 2025',
  description: 'The Biggest GDG Event in Ibadan',
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootLayout>
      <Toaster position="top-right" expand={true} richColors />
      {children}
    </RootLayout>
  );
}
