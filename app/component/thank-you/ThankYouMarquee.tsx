import { THANK_YOU } from '@/app/_module/data/thank-you.data';

function Tape({
  className,
  track,
}: {
  className: string;
  track: 'tape-track-left' | 'tape-track-right';
}) {
  // Two identical halves so translating by -50% loops seamlessly.
  const half = Array.from({ length: 8 }, (_, i) => (
    <span key={i} className="px-4">
      {THANK_YOU.tape}
    </span>
  ));
  return (
    <div
      aria-hidden="true"
      className={`absolute left-[-5%] w-[110%] overflow-hidden bg-[#DB3A34] py-4 text-[20px] font-semibold text-white sm:text-[28px] ${className}`}
    >
      <div className={`flex w-max whitespace-nowrap ${track}`}>
        <div className="flex">{half}</div>
        <div className="flex">{half}</div>
      </div>
    </div>
  );
}

export default function ThankYouMarquee() {
  return (
    <div className="relative h-[190px] overflow-hidden bg-[#E3CC8F] sm:h-[240px]">
      <p className="sr-only">{THANK_YOU.tape}</p>
      <Tape track="tape-track-left" className="top-[22%] -rotate-[3deg]" />
      <Tape track="tape-track-right" className="top-[48%] rotate-[3deg]" />
    </div>
  );
}
