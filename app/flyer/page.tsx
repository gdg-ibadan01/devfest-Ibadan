import FlyerForm from './components/FlyerForm';

export const metadata = {
  title: 'Create your flyer | DevFest Ibadan 2026',
  description:
    'Generate your "I will be attending" flyer for DevFest Ibadan 2026 on 21 November at Kakanfo Inn & Conference Centre and share it with your friends.',
  openGraph: {
    title: 'I will be attending DevFest Ibadan 2026',
    description:
      'Create your attendee flyer and get your ticket at devfestibadan.com.',
    siteName: 'DevFest Ibadan 2026',
    type: 'website',
    url: 'https://devfestibadan.com/flyer',
  },
};

export default function FlyerPage() {
  return (
    <main className="min-h-screen bg-[#F8F6E2] pt-[80px]">
      <FlyerForm />
    </main>
  );
}
