import { ORGANIZER } from '@/app/_module/config/seo';

export const THANK_YOU = {
  headline: ['THANK YOU!!!', 'IBADAN.'],
  subline:
    'One community. Countless possibilities. Thank you for making DevFest 2026 memorable.',
  tape: 'Thank you for coming!',
  barText: 'DevFest Ibadan 2026 was a success. Thank you, Ibadan!',
  /** Paste the feedback form link here to show the feedback button. */
  feedbackUrl: 'https://tinyurl.com/ibadandevfestfeedback',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/gdg-ibadan' },
    { label: 'X', href: 'https://x.com/gdgibadan' },
    { label: 'Instagram', href: 'https://www.instagram.com/gdgibadan' },
    { label: 'GDG Community', href: ORGANIZER.url },
  ],
  groups: {
    sponsors: {
      title: 'Our sponsors and partners',
      text: 'You believed in the community and powered the day. We could not have done it without you.',
    },
    speakers: {
      title: 'Our speakers',
      text: 'You shared your time, stories and knowledge, and sent a room full of builders home inspired.',
    },
    organizers: {
      title: 'Our organizers',
      text: 'Months of planning, late nights and a lot of heart. Thank you for making it happen.',
    },
    volunteers: {
      title: 'Our volunteers',
      text: 'From the registration desk to the last chair packed, you kept everything running with a smile. You are the heartbeat of DevFest.',
      /** Add volunteer names here and they will be listed on the page. */
      names: [] as string[],
    },
    attendees: {
      title: 'Our attendees',
      text: 'You came, you connected and you made the energy unforgettable. DevFest is nothing without you.',
    },
  },
  closing: 'See you at DevFest Ibadan 2027.',
};
