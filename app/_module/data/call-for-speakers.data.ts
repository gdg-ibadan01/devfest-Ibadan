export interface SubmissionStep {
  title: string;
  description: string;
  dotColor: string;
}

export interface SpeakerStat {
  stat: string;
  color: string;
  label: string;
  description: string;
}

export const submissionSteps: SubmissionStep[] = [
  {
    title: 'Applications open',
    description: 'Submit your topic and abstract',
    dotColor: '#34A853', // Green
  },
  {
    title: 'Review period',
    description: 'Our team reviews all submissions',
    dotColor: '#FBBC04', // Yellow
  },
  {
    title: 'Speakers announced',
    description: 'Selected speakers notified via email',
    dotColor: '#EA4335', // Red
  },
  {
    title: 'Event day — 21st Nov 2026',
    description: 'Take the stage at DevFest Ibadan',
    dotColor: '#4285F4', // Blue
  },
];

export const statsData: SpeakerStat[] = [
  {
    stat: '2-DAY',
    color: '#34A853', // Green
    label: '21 NOVEMBER 2026',
    description: 'Expert talks, code labs, and pure technical vibes.',
  },
  {
    stat: 'All TRACKS',
    color: '#EA4335', // Red
    label: 'WEB · MOBILE · AI · ETC.',
    description:
      'Deep-dive tracks tailored specifically to the domains defining modern global tech.',
  },
  {
    stat: '30+ SPEAKERS',
    color: '#FBBC04', // Yellow
    label: 'INDUSTRY LEADERS',
    description:
      'Learn design, scale, and performance patterns from engineering giants.',
  },
  {
    stat: '10+ YEARS',
    color: '#4285F4', // Blue
    label: 'COMMUNITY LEGACY',
    description:
      'Celebrating 10+ years of empowering and connecting tech lovers and enthusiast',
  },
];
