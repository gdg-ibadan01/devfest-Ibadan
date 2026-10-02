import { TicketPricingCardProps } from '@/app/component/TicketPricingCard';

export type TicketTier = TicketPricingCardProps & { id: string };

export const ticketTiers: TicketTier[] = [
  {
    id: 'early-bird',
    name: 'EARLY BIRD',
    price: '₦5,000',
    subtitle: 'Save before Oct 4',
    badge: 'BEST VALUE',
    isPopular: true,
    isActive: true,
    buttonText: 'Get Ticket',
    buttonHref: '/tickets/buy?tier=early-bird',
    features: [
      'Entry to all tracks',
      'Workshops & codelabs',
      'Networking sessions',
      'Lunch & refreshments',
      'Event swag bag',
      'Certificate of attendance',
    ],
  },
  {
    id: 'regular',
    name: 'REGULAR',
    price: '₦6,000',
    subtitle: 'Standard admission',
    buttonText: 'Get tickets',
    buttonHref: '/tickets/buy?tier=regular',
    features: [
      'Entry to all tracks',
      'Workshops & codelabs',
      'Networking sessions',
      'Lunch & refreshments',
      'Event swag bag',
      'Certificate of attendance',
    ],
  },
  {
    id: 'group-of-5',
    name: 'GROUP OF 5',
    price: '₦20,000',
    subtitle: '₦4,000/person · Bring your squad',
    buttonText: 'Get tickets',
    buttonHref: '/tickets/buy?tier=group-of-5',
    features: [
      '5 tickets included',
      'Entry to all tracks',
      'Workshops & codelabs',
      'Networking sessions',
      'Lunch & refreshments',
      'Group swag bundle',
    ],
  },
  {
    id: 'late',
    name: 'LATE',
    price: '₦10,000',
    subtitle: 'Last 10 days · Nov 11-21',
    buttonText: 'Get tickets',
    buttonHref: '/tickets/buy?tier=late',
    features: [
      'Entry to all tracks',
      'Workshops & codelabs',
      'Networking sessions',
      'Lunch & refreshments',
      'Certificate of attendance',
    ],
  },
];
