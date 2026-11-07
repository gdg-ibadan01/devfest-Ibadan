import type { Metadata } from 'next';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  OG_IMAGE,
  SITE_NAME,
} from './_module/config/seo';
import CallForPartnership from './component/CallForPartnership';
import DevfestHero from './component/DevfestHero';
import EventJsonLd from './component/EventJsonLd';
import HowItGoesDown from './component/HowItGoesDown';
import OurSponsors from './component/OurSponsors';
import SecureYourTickets from './component/SecureYourTickets';
import SwagsAndTickets from './component/SwagsAndTickets';

export const metadata: Metadata = {
  title: { absolute: DEFAULT_TITLE },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    'DevFest Ibadan 2026',
    'GDG Ibadan',
    'developer conference Ibadan',
    'tech conference Nigeria',
    'Google Developer Group',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: '/',
    siteName: SITE_NAME,
    locale: 'en_NG',
    type: 'website',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

export default function Home() {
  return (
    <main id="content">
      <EventJsonLd />
      <DevfestHero />
      {/* <SponsorsMarquee /> */}
      {/* <CallForSpeakers /> */}
      <SwagsAndTickets />
      <HowItGoesDown />
      <OurSponsors />
      <CallForPartnership />
      {/* <MeetOurSpeakers /> */}
      <SecureYourTickets />
    </main>
  );
}
