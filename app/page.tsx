import type { Metadata } from 'next';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  OG_IMAGE,
  SITE_NAME,
} from './_module/config/seo';
import AlatpayAd from './component/AlatpayAd';
import { EVENT_ENDED } from './_module/config/event-status';
import StayConnected from './component/thank-you/StayConnected';
import ThankYouHero from './component/thank-you/ThankYouHero';
import ThankYouMarquee from './component/thank-you/ThankYouMarquee';
import ThankYouWall from './component/thank-you/ThankYouWall';
import CallForPartnership from './component/CallForPartnership';
import DevfestHero from './component/DevfestHero';
import EventJsonLd from './component/EventJsonLd';
import HowItGoesDown from './component/HowItGoesDown';
import OurSponsors from './component/OurSponsors';
import SecureYourTickets from './component/SecureYourTickets';
import SwagsAndTickets from './component/SwagsAndTickets';
import MeetOurSpeakers from './component/MeetOurSpeakers';
import ExploreAgenda from './component/ExploreAgenda';

export const metadata: Metadata = {
  title: {
    absolute: EVENT_ENDED
      ? 'Thank You, Ibadan | DevFest Ibadan 2026'
      : DEFAULT_TITLE,
  },
  description: EVENT_ENDED
    ? 'DevFest Ibadan 2026 was a success. Thank you to our attendees, speakers, sponsors, volunteers and organizers for making it memorable.'
    : DEFAULT_DESCRIPTION,
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
  if (EVENT_ENDED) {
    return (
      <main id="content">
        <EventJsonLd />
        <ThankYouHero />
        <ThankYouMarquee />
        <ThankYouWall />
        <OurSponsors />
        <AlatpayAd />
        <StayConnected />
      </main>
    );
  }

  return (
    <main id="content">
      <EventJsonLd />
      <DevfestHero />
      {/* <SponsorsMarquee /> */}
      <SwagsAndTickets />
      <HowItGoesDown />
      <MeetOurSpeakers />
      <OurSponsors />
      <AlatpayAd />
      <CallForPartnership />
      <ExploreAgenda />
      <SecureYourTickets />
    </main>
  );
}
