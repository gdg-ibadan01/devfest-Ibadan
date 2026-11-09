import { Sponsor } from '@/app/component/SponsorCard';
export type { Sponsor };

export const SPONSORS_2026: Sponsor[] = [
  {
    name: 'Google',
    website: 'google.com',
    logo: 'google.png',
    width: 112,
    height: 46.667,
    description:
      'Global technology leader empowering developers with cutting-edge tools, platforms, and AI innovation.',
  },
  {
    name: 'Notzero',
    website: 'notzero.tech',
    logo: 'notzero.png',
    width: 135,
    height: 48,
    description:
      'Building scalable, high-impact digital products and developer-first software experiences.',
  },
  {
    name: 'Chowdeck',
    website: 'chowdeck.com',
    logo: 'chowdeck.png',
    width: 165,
    height: 25,
    description:
      'Leading on-demand food and grocery delivery platform in Africa, delivering meals and essentials in minutes.',
  },
  {
    name: 'Tradestack',
    website: 'usetradestack.com',
    logo: 'tradestack.png',
    width: 200,
    height: 28,
    description:
      'TradeStack is a cross-border commerce and payments platform that enables individuals and businesses to buy and sell cryptocurrency, trade gift cards, source products from China, make supplier payments in RMB, and access pre-order financing solutions all from a single platform.',
  },
];

export const sponsors = SPONSORS_2026;
export default SPONSORS_2026;
