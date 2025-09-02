import type { Metadata } from 'next';
import './globals.css';
import RootLayout from './layouts';

export const metadata: Metadata = {
  title: 'Devfest Ibadan 2025',
  description: 'The Biggest GDG Event in Ibadan',
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayout>{children}</RootLayout>;
}
