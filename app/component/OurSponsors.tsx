import Image from 'next/image';
import { Button } from '@/components/ui/button';

const sponsors = [
  {
    name: 'Cardify',
    website: 'cardify.com',
    logo: 'cardify.png',
    width: 183.065,
    height: 44,
  },
  {
    name: 'Obiex',
    website: 'obiex.com',
    logo: 'obiex.png',
    width: 156.75,
    height: 44,
  },
  {
    name: 'Foodbolt',
    website: 'foodbolt.com',
    logo: 'foodbolt.png',
    width: 170,
    height: 115.513,
  },
  {
    name: 'Google',
    website: 'google.com',
    logo: 'google.png',
    width: 112,
    height: 46.667,
  },
  {
    name: 'Interswitch',
    website: 'interswitchgroup.com',
    logo: 'interswitch.png',
    width: 161,
    height: 44.107,
  },
  {
    name: 'Heyfood',
    website: 'heyfood.com',
    logo: 'heyfood.png',
    width: 122.332,
    height: 46.843,
  },
];

export default function OurSponsors() {
  return (
    <section
      id="sponsors"
      aria-labelledby="sponsors-heading"
      className="bg-white font-inter"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[40px] px-4 py-[64px] sm:px-6 lg:px-[80px] lg:py-[96px]">
        <div className="flex flex-col items-start justify-between gap-[24px] lg:flex-row lg:gap-[40px]">
          <div className="max-w-[720px]">
            <h2
              id="sponsors-heading"
              className="font-grotesk text-[36px] font-semibold leading-[1.2] text-social-dark sm:text-[48px]"
            >
              Our sponsors
            </h2>
            <p className="mt-[8px] text-[16px] leading-[1.5] text-[#4a4a4a]">
              Behind every great developer gathering is a community of
              supporters.
              <br className="hidden sm:block" /> Meet the brands helping ideas,
              connections and possibilities grow.
            </p>
          </div>
          <div className="shrink-0 rounded-[100px] bg-[conic-gradient(from_0deg,#34a853,#fbbc04,#ea4335,#4285f4,#ea4335,#fbbc04,#34a853)] p-[2px]">
            <Button
              asChild
              className="h-auto w-[228px] rounded-[100px] bg-social-dark px-[30px] py-[22px] text-[16px] font-bold leading-[1.6] text-white hover:bg-social-dark/90"
            >
              <a href="#partnership">Become a sponsor</a>
            </Button>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-px border border-[#f0f0f0] bg-[#f0f0f0] sm:grid-cols-2 lg:grid-cols-3">
          {sponsors.map((sponsor, index) => (
            <li
              key={sponsor.website}
              className={index === 0 ? 'bg-[#eef6fc]' : 'bg-white'}
            >
              <a
                href={`https://${sponsor.website}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${sponsor.name} (opens in a new tab)`}
                className="group flex h-[271px] flex-col justify-between px-[32px] pb-[17px] pt-[32px] transition-colors hover:bg-core-blue/5 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-core-blue"
              >
                <div className="relative min-h-0 flex-1 overflow-hidden">
                  <Image
                    src={`/sponsors/${sponsor.logo}`}
                    alt={sponsor.name}
                    width={Math.round(sponsor.width)}
                    height={Math.round(sponsor.height)}
                    unoptimized
                    className="absolute max-w-none object-cover"
                    style={{
                      width: sponsor.width,
                      height: sponsor.height,
                      left:
                        sponsor.name === 'Foodbolt'
                          ? -9.67
                          : sponsor.name === 'Interswitch'
                            ? -0.33
                            : 0,
                      top: sponsor.name === 'Foodbolt' ? -36 : 0,
                    }}
                  />
                </div>
                <div
                  className={`flex items-center justify-between gap-[8px] border-t pt-[14px] ${index === 0 ? 'border-pastel-blue' : 'border-[#f0f0f0]'}`}
                >
                  <span className="text-[14px] font-medium leading-[20px] text-[#111] group-hover:underline">
                    {sponsor.website}
                  </span>
                  <Image
                    src="/sponsors/arrow-up-right.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="shrink-0"
                  />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
