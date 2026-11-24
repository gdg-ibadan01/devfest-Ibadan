import Image from 'next/image';
import {
  ALATPAY_AD,
  ALATPAY_AD_SIZES,
} from '@/app/_module/data/alatpay-ad.data';

function Placeholder({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 bg-gradient-to-r from-[#fdecef] via-[#f6e6f0] to-[#efe4f3] text-center ${className}`}
    >
      <Image
        src="/sponsors/alatpay.png"
        alt=""
        width={64}
        height={53}
        className="h-[53px] w-auto"
      />
      <p className="text-[14px] font-medium text-[#4a4a4a]">{label}</p>
    </div>
  );
}

export default function AlatpayAd() {
  const { href, alt, desktopSrc, mobileSrc, caption, ctaLabel } = ALATPAY_AD;
  const hasCreative = Boolean(desktopSrc || mobileSrc);
  const isDev = process.env.NODE_ENV !== 'production';

  // Nothing to show until ALATPay supplies their banner; only preview the layout in development.
  if (!hasCreative && !isDev) return null;

  const desktop = ALATPAY_AD_SIZES.desktop;
  const mobile = ALATPAY_AD_SIZES.mobile;

  return (
    <section
      id="payment-partner"
      aria-labelledby="payment-partner-heading"
      className="bg-white font-inter"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[20px] px-4 pb-[64px] sm:px-6 lg:px-[80px] lg:pb-[96px]">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="payment-partner-heading"
            className="rounded-[100px] border border-[#e5e5e5] px-[14px] py-[6px] text-[12px] font-semibold uppercase leading-[1.2] tracking-[0.08em] text-social-dark"
          >
            Payment Partner
          </h2>
          <span className="text-[12px] text-[#7a7a7a]">Sponsored</span>
        </div>

        <a
          href={href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          aria-label={`${alt} (sponsored, opens in a new tab)`}
          className="group block overflow-hidden rounded-[24px] border border-[#f0f0f0] shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-core-blue motion-reduce:transition-none"
        >
          {hasCreative ? (
            <>
              {mobileSrc ? (
                <Image
                  src={mobileSrc}
                  alt={alt}
                  width={mobile.width}
                  height={mobile.height}
                  sizes="(max-width: 767px) 100vw, 0px"
                  className={`h-auto w-full ${desktopSrc ? 'md:hidden' : ''}`}
                />
              ) : null}
              {desktopSrc ? (
                <Image
                  src={desktopSrc}
                  alt={alt}
                  width={desktop.width}
                  height={desktop.height}
                  sizes="(min-width: 768px) 1280px, 0px"
                  className={`h-auto w-full ${mobileSrc ? 'hidden md:block' : ''}`}
                />
              ) : null}
            </>
          ) : (
            <>
              <Placeholder
                label={`Mobile banner: ${mobile.width} x ${mobile.height}px (1:1)`}
                className="aspect-square md:hidden"
              />
              <Placeholder
                label={`Desktop banner: ${desktop.width} x ${desktop.height}px (4:1)`}
                className="hidden aspect-[4/1] md:flex"
              />
            </>
          )}
        </a>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-[14px] leading-[1.5] text-[#4a4a4a]">
            {caption ?? ''}
          </p>
          <div className="w-full shrink-0 rounded-[100px] bg-[conic-gradient(from_0deg,#34a853,#fbbc04,#ea4335,#4285f4,#ea4335,#fbbc04,#34a853)] p-[2px] sm:w-auto">
            <a
              href={href}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="block rounded-[100px] bg-social-dark px-[30px] py-[14px] text-center text-[15px] font-bold text-white hover:bg-social-dark/90"
            >
              {ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
