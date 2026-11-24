import Image from 'next/image';
import { SPONSORS_2026 } from '@/app/_module/data/sponsors.data';
import { THANK_YOU } from '@/app/_module/data/thank-you.data';

const BLOCKS = [
  'bg-[#EA4335] [clip-path:polygon(50%_0,100%_100%,0_100%)]',
  'bg-[#FBBC04] border-2 border-[#1a1a1a]',
  'bg-[#4285F4] -skew-x-[20deg] border-2 border-[#1a1a1a]',
  'bg-[#34A853] border-2 border-[#1a1a1a]',
  'bg-[#F06EAA] [clip-path:polygon(50%_0,100%_100%,0_100%)]',
];

function Skyline() {
  return (
    <svg
      viewBox="0 0 1200 220"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className="absolute inset-x-0 bottom-[44px] h-[140px] w-full fill-[#5b4a1a]/80 sm:h-[200px]"
    >
      <rect x="0" y="60" width="120" height="160" />
      <rect x="150" y="40" width="26" height="180" />
      <rect x="140" y="30" width="46" height="26" />
      <circle cx="330" cy="120" r="30" />
      <rect x="318" y="120" width="24" height="100" />
      <rect x="480" y="100" width="260" height="120" />
      <rect x="570" y="60" width="80" height="60" />
      <rect x="830" y="20" width="110" height="200" />
      <rect x="878" y="0" width="14" height="24" />
      <rect x="990" y="70" width="40" height="150" />
      <rect x="1080" y="110" width="120" height="110" />
      <circle cx="400" cy="150" r="42" />
      <circle cx="1060" cy="150" r="40" />
    </svg>
  );
}

export default function ThankYouHero() {
  return (
    <section
      id="thank-you"
      aria-labelledby="thank-you-heading"
      className="relative isolate overflow-hidden bg-[#E3CC8F] pt-[130px] text-[#1a1a1a] sm:pt-[150px] lg:pt-[175px]"
    >
      <Image
        src="/8T5A1216.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover opacity-25 mix-blend-multiply grayscale sepia blur-[2px]"
      />

      {/* Decorative shapes */}
      <svg
        aria-hidden="true"
        viewBox="0 0 120 120"
        className="absolute -left-10 top-[44%] hidden h-[140px] w-[140px] sm:block lg:h-[220px] lg:w-[220px]"
      >
        <g
          stroke="#1a1a1a"
          strokeWidth="5"
          strokeLinejoin="round"
          fill="#F06EAA"
        >
          <path d="M20 34 34 20 60 46 86 20 100 34 74 60 100 86 86 100 60 74 34 100 20 86 46 60Z" />
        </g>
      </svg>
      <div
        aria-hidden="true"
        className="absolute right-3 top-[34%] hidden flex-col gap-3 sm:flex lg:right-10"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-[44px] w-[44px] rounded-[50%] border-[3px] border-[#1a1a1a] bg-[#34A853] lg:h-[72px] lg:w-[72px]"
          />
        ))}
      </div>

      <div className="mx-auto flex max-w-[1100px] flex-col items-center px-4 pb-[300px] text-center sm:px-6 sm:pb-[380px]">
        <h1
          id="thank-you-heading"
          className="font-grotesk text-[56px] font-black uppercase leading-[0.95] tracking-tight sm:text-[104px] lg:text-[140px]"
        >
          {THANK_YOU.headline[0]}
          <br />
          {THANK_YOU.headline[1]}
        </h1>
        <p className="mt-6 max-w-[560px] text-[18px] leading-[1.5] sm:text-[24px]">
          {THANK_YOU.subline}
        </p>

        <p className="mt-8 rounded-[100px] border border-[#4285F4] bg-white/70 px-6 py-2 font-mono text-[13px] font-semibold">
          Our proud sponsors and partners
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-8">
          {SPONSORS_2026.map((s) => (
            <li
              key={s.name}
              className="flex h-[44px] w-[112px] items-center justify-center sm:h-[52px] sm:w-[140px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.logo.startsWith('/') ? s.logo : `/sponsors/${s.logo}`}
                alt={s.name}
                className="max-h-full max-w-full object-contain"
              />
            </li>
          ))}
        </ul>
      </div>

      <Skyline />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[44px]">
        <div className="absolute inset-x-0 bottom-0 h-[32px] bg-[#E8A20B]" />
        <div className="absolute inset-x-0 bottom-[20px] flex items-end justify-around px-2">
          {[...BLOCKS, ...BLOCKS].map((cls, i) => (
            <span key={i} className={`h-[26px] w-[34px] sm:w-[56px] ${cls}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
