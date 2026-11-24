import { THANK_YOU } from '@/app/_module/data/thank-you.data';

const pill =
  'rounded-[100px] border border-[#1a1a1a] px-6 py-3 text-[15px] font-bold transition-colors';

export default function StayConnected() {
  return (
    <section
      aria-labelledby="stay-heading"
      className="bg-[#1a1a1a] font-inter text-white"
    >
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-6 px-4 py-[64px] text-center sm:px-6">
        <h2
          id="stay-heading"
          className="font-grotesk text-[32px] font-black sm:text-[48px]"
        >
          {THANK_YOU.closing}
        </h2>
        <p className="max-w-[520px] text-[16px] leading-[1.6] text-white/80">
          Tell us how we did and stay close to the community for what comes
          next.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {THANK_YOU.feedbackUrl ? (
            <a
              href={THANK_YOU.feedbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${pill} border-[#FBBC04] bg-[#FBBC04] text-[#1a1a1a] hover:bg-[#fcc934]`}
            >
              Share your feedback
            </a>
          ) : null}
          {THANK_YOU.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${pill} border-white/60 text-white hover:bg-white hover:text-[#1a1a1a]`}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
