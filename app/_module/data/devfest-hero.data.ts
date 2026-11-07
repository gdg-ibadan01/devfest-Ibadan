export const TARGET_DATE_STRING = '2026-11-21T08:00:00+01:00';
export const TARGET_DATE = new Date(TARGET_DATE_STRING).getTime();

export const HERO_DATA = {
  venue: 'KAKANFO INN & CONFERENCE CENTRE',
  date: '21ST NOV 2026',
  targetDateString: TARGET_DATE_STRING,
  targetDate: TARGET_DATE,
  title: 'DEVFEST IBADAN 2026.',
  subtitle:
    "Ibadan Nigeria's biggest developer conference. Tickets from ₦5,000.",
  tickets: {
    title: 'Tickets Available',
    badge: 'BEST VALUE',
    description: 'Secure your ticket at ₦5,000.',
    buyHref: '/tickets/buy',
  },
};
