export const TARGET_DATE_STRING = '2026-11-21T08:00:00+01:00';
export const TARGET_DATE = new Date(TARGET_DATE_STRING).getTime();

export const HERO_DATA = {
  venue: 'KAKANFO INN & CONFERENCE CENTRE',
  date: '21ST NOV 2026',
  targetDateString: TARGET_DATE_STRING,
  targetDate: TARGET_DATE,
  title: 'DEVFEST IBADAN 2026.',
  subtitle:
    "Ibadan Nigeria's biggest developer conference. Early bird tickets from ₦5,000.",
  earlyBird: {
    title: 'Early Bird Active',
    badge: 'BEST VALUE',
    description:
      'Secure your ticket at ₦5,000 - first 300 only. Closes October 4, 2026.',
    buyHref: '/tickets/buy',
  },
};
