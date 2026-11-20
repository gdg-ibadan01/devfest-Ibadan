import type { Metadata } from 'next';
import { speakersData } from '../_module/data/meet-our-speakers.data';
import { SpeakerCard } from '../component/SpeakerCard';

export const metadata: Metadata = {
  title: 'Speakers',
  description:
    'Meet the DevFest Ibadan speakers and explore their sessions, workshops, and social profiles.',
  alternates: { canonical: '/speakers' },
};

export default function Speakers() {
  return (
    <main
      id="content"
      className="min-h-screen bg-[#F8F6E2] pt-[112px] pb-[80px] sm:pt-[128px] sm:pb-[96px] lg:pt-[176px] lg:pb-[112px]"
    >
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <header className="mb-12 mt-6 max-w-2xl sm:mb-14">
          <h1 className="font-grotesk text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl md:text-5xl">
            Meet Our Speakers
          </h1>
          <p className="mt-3 font-sans text-sm leading-relaxed text-[#4B5563] sm:text-base">
            Meet the industry leaders and innovators taking the stage at DevFest
            Ibadan. Explore their sessions and connect with them.
          </p>
        </header>
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {speakersData.map((speaker, index) => (
            <SpeakerCard key={speaker.id} speaker={speaker} index={index % 4} />
          ))}
        </div>
      </div>
    </main>
  );
}
