import { PartnerContact, PartnershipBenefit, PartnershipStat } from './types';

export const PARTNERSHIP_CONTACTS: PartnerContact[] = [
  {
    name: 'Abidemi',
    role: 'Partnership Lead',
    email: 'abidemi@gdgibadan.com',
    accentColor: '#4285F4', // Blue
    badgeBg: '#D2E3FC',
  },
  {
    name: 'Josh',
    role: 'Partnership Lead',
    email: 'josh@gdgibadan.com',
    accentColor: '#34A853', // Green
    badgeBg: '#D5F5D0',
  },
];

export const PARTNERSHIP_BENEFITS: PartnershipBenefit[] = [
  {
    title: 'Brand visibility & exposure',
    description:
      'Feature prominently across our keynote stage, banners, conference website, and social media reaching tens of thousands.',
    dotColor: '#4285F4', // Blue
  },
  {
    title: 'Direct talent & recruitment access',
    description:
      'Connect with a vibrant pool of 2,000+ top software engineers, designers, AI practitioners, and product thinkers.',
    dotColor: '#34A853', // Green
  },
  {
    title: 'Exhibition booth & product demos',
    description:
      'Showcase your developer tools, APIs, platform, or hardware directly to attendees through physical demo booths.',
    dotColor: '#FBBC04', // Yellow
  },
  {
    title: 'Community impact & leadership',
    description:
      'Champion tech education and developer growth in Southwest Nigeria, powering the next generation of African builders.',
    dotColor: '#EA4335', // Red
  },
];

export const PARTNERSHIP_STATS: PartnershipStat[] = [
  {
    value: '2,000+',
    label: 'EXPECTED ATTENDEES',
    description: 'Developers, designers, founders, and tech enthusiasts.',
    color: '#4285F4', // Blue
  },
  {
    value: '30+',
    label: 'SESSIONS & TRACKS',
    description: 'Deep dives across AI, Web, Cloud, Mobile, and Security.',
    color: '#34A853', // Green
  },
  {
    value: '50+',
    label: 'COMPANIES REPRESENTED',
    description: 'Startups, scaleups, and global technology organizations.',
    color: '#FBBC04', // Yellow
  },
  {
    value: '10+ YRS',
    label: 'COMMUNITY LEGACY',
    description: 'A decade of impactful tech community events in Ibadan.',
    color: '#EA4335', // Red
  },
];

export const PARTNERSHIP_MAILTO_ALL =
  'mailto:abidemi@gdgibadan.com,josh@gdgibadan.com?subject=DevFest%20Ibadan%202026%20Partnership%20Inquiry&body=Hello%20DevFest%20Ibadan%20Partnership%20Team%2C%0A%0AI%20am%20interested%20in%20partnering%20with%20DevFest%20Ibadan%202026.%20Please%20share%20more%20information%20about%20sponsorship%20and%20collaboration%20opportunities.%0A%0ABest%20regards%2C';

export const PARTNERSHIP_WHATSAPP_LINK =
  "https://wa.me/2348136023230?text=I'm%20ready%20to%20power%20the%20future%20of%20tech%20at%20DevFest%20Ibadan%202026.%20I%20would%20like%20to%20inquire%20about%20sponsorship%20opportunities%21%20Let's%20connect%20to%20build%20something%20great.";
