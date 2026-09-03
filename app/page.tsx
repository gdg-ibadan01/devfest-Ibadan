import CountDown from './component/CountDown';
import DevfestHero from './component/DevfestHero';
import Inclusivity from './component/Inclusivity';
import Recap from './component/Recap';
import OurSpeakers from './component/OurSpeakers';
import Venue from './component/Venue';
import OurSponsors from './component/OurSponsors';
import OurMerch from './component/OurMerch';

export const metadata = {
  title: 'DevFest Ibadan 2026',
  description:
    'Join us at DevFest Ibadan 2026 - The largest developer conference in Southwest Nigeria. Connect with tech experts, learn about the latest technologies, and be part of an inclusive tech community.',
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
      'Join us at DevFest Ibadan 2026 - The largest developer conference in Southwest Nigeria. Connect with tech experts, learn about the latest technologies, and be part of an inclusive tech community.',
    images: [
      'https://res.cloudinary.com/dh8trnu8w/image/upload/q_auto/v1755685267/email-template-banner.png',
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
      'Join us at DevFest Ibadan 2026 - The largest developer conference in Southwest Nigeria. Connect with tech experts, learn about the latest technologies, and be part of an inclusive tech community.',
    images: [
      'https://res.cloudinary.com/dh8trnu8w/image/upload/q_auto/v1755685267/email-template-banner.png',
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
      <Inclusivity />
      <Recap />
      <CountDown />
      <Venue />
      <OurSpeakers />
      <OurSponsors />
      <OurMerch />
    </>
  );
}
