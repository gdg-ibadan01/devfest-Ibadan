import CallForSpeakers from './component/CallForSpeakers';
import CallForPartnership from './component/CallForPartnership';
import DevfestHero from './component/DevfestHero';
import HowItGoesDown from './component/HowItGoesDown';
import SwagsAndTickets from './component/SwagsAndTickets';

export const metadata = {
  title: 'DevFest Ibadan 2026',
  description:
    'Join DevFest Ibadan 2026 on 21 November at Kakanfo Inn & Conference Centre for talks, workshops, codelabs and networking.',
  keywords: [
    'DevFest',
    'GDG Ibadan',
    'Tech Conference',
    'Developers',
    'Technology',
    'Google',
    'Tech community',
    'open source',
  ],
  openGraph: {
    title: 'DevFest Ibadan 2026',
    description:
      'Join DevFest Ibadan 2026 on 21 November at Kakanfo Inn & Conference Centre for talks, workshops, codelabs and networking.',
    images: [
      'https://res.cloudinary.com/dh8trnu8w/image/upload/v1789055800/email-image_zgldak.png',
      'https://res.cloudinary.com/dh8trnu8w/image/upload/v1756199854/devfestlogo.jpg',
    ],
    siteName: 'DevFest Ibadan 2026',
    locale: 'en_US',
    type: 'website',
    url: 'https://devfestibadan.com',
  },
  canonical: 'https://devfestibadan.com',
  themeColor: '#4285f4',
  lang: 'en',
  langDir: 'ltr',
  locale: 'en_US',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      image: true,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevFest Ibadan 2026',
    description:
      'Join DevFest Ibadan 2026 on 21 November at Kakanfo Inn & Conference Centre for talks, workshops, codelabs and networking.',
    images: [
      'https://res.cloudinary.com/dh8trnu8w/image/upload/v1789055800/email-image_zgldak.png',
      'https://res.cloudinary.com/dh8trnu8w/image/upload/v1756199854/devfestlogo.jpg',
    ],
    type: 'website',
    url: 'https://devfestibadan.com',
  },
};

export default function Home() {
  return (
    <>
      <DevfestHero />
      <CallForSpeakers />
      <SwagsAndTickets />
      <HowItGoesDown />
      <CallForPartnership />
    </>
  );
}
