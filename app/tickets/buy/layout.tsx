import { pageMetadata } from '@/app/_module/config/seo';

export const metadata = pageMetadata({
  title: 'Buy Tickets',
  description:
    'Buy your DevFest Ibadan 2026 ticket. Standard, group and gift tickets for the 21 November developer conference at Kakanfo Inn, Ibadan.',
  path: '/tickets/buy',
});

export default function BuyTicketsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
