import { SwagTicketCardProps } from '@/app/component/SwagTicketCard';

export const swagPerks: string[] = [
  'Official DevFest T-Shirt & Lanyard',
  'Custom DevFest Slingshot & Notepad',
  'DevFest Bottle',
  'And More DevFest Goodies..',
];

export const ticketPerks: string[] = [
  'Entry pass to all tracks',
  'Access to Sponsor Booth Swags',
  'Access to Workshop & Codelabs',
  'Networking Opportunities with Speakers & Attendees',
];

export const swagsAndTicketsCards: SwagTicketCardProps[] = [
  {
    title: 'Get swags',
    category: 'STANDARD SWAG',
    description: 'Score the official DevFest Ibadan 2026 premium merch pack.',
    perks: swagPerks,
    buttonText: 'Buy swags',
    buttonHref: 'https://selar.co/m/gdg-ibadan1',
    isExternal: true,
    colorScheme: 'green',
    delay: 0,
  },
  {
    title: 'Get tickets',
    category: 'ALL ACCESS PASS',
    description:
      'Reserve your guaranteed spot at the biggest developer experience in Ibadan.',
    perks: ticketPerks,
    buttonText: 'Get tickets',
    buttonHref: '/tickets/buy',
    colorScheme: 'red',
    delay: 0.15,
  },
];

export const cardsData = swagsAndTicketsCards;
