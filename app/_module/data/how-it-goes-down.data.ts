export interface EventCard {
  eventTag: string;
  dateTag: string;
  title: string;
  label: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  isExternal?: boolean;
  disabled?: boolean;
  colorScheme: 'green' | 'blue' | 'red';
}

export const eventCards: EventCard[] = [
  {
    eventTag: 'DEVFEST IBADAN 2026.',
    dateTag: 'OCT-NOV 2026',
    title: 'PreDevFest series',
    label: 'LEAD-IN EXPERIENCE',
    description:
      '3 weekends of workshops, talks, and community sessions leading up to the main event (1 week gap between each).',
    buttonText: 'Coming soon',
    buttonHref: '/tickets/buy',
    colorScheme: 'green',
    disabled: true,
  },
  {
    eventTag: 'DEVFEST IBADAN 2026.',
    dateTag: '20 NOV 2026',
    title: 'Virtual event',
    label: 'REMOTE ACCESS',
    description:
      'Join us online the Friday before D-Day. Keynotes, panels, and networking — from anywhere in the world.',
    buttonText: 'Coming soon',
    buttonHref: '/tickets/buy',
    disabled: true,
    colorScheme: 'blue',
  },
  {
    eventTag: 'DEVFEST IBADAN 2026.',
    dateTag: '21 NOV 2026',
    title: 'Physical event',
    label: 'MAIN EVENT',
    description:
      'The main event! A full day of talks across all tracks, workshops, codelabs, sponsor booths, networking, and swag — live at Kakanfo Inn, Ibadan.',
    buttonText: 'Register here',
    buttonHref: '/tickets/buy',
    colorScheme: 'red',
  },
];
