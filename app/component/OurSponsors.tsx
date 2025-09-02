'use client';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import oneapp from '@/public/1appnewlogo.8e95dfd0.png';
import turing from '@/public/turing.png';
import altschool from '@/public/altschool-africa-logo-4365C6B160-seeklogo.com.png';
import cardify from '@/public/Cardify-Africa-Logo-Black-544-by-180.png';
import codemagic from '@/public/codemagic.svg';
import digitalocean from '@/public/digitalocean-2.svg';
import google from '@/public/Google_Icons-09-512.webp';
import youverify from '@/public/logo_iffgzd.svg';
import heyfood from '@/public/logo-long.svg';
import ship from '@/public/shiip.png';
import halal from '@/public/SuegFTtO_400x400.jpg';
import ton from '@/public/TONSociety.png';
import github from '@/public/White2.png';
import lorry from '@/public/lorry.jpg';
// import interswitch from '@/public/interswitch.jpg';
import interswitch from '@/public/inter-switch.png';
import { Button } from '../_module/components/ui/button';
import { cn } from '../_module/lib/utils';

interface SponsorImageProps {
  imageSrc: StaticImageData;
  alt: string;
  divClassName: string;
  imgDimension?: string;
}

function SponsorImage({ imageSrc, alt, divClassName }: SponsorImageProps) {
  return (
    <div
      className={`${divClassName} hover:scale-110 transition-transform duration-300`}
    >
      <Image
        src={imageSrc}
        alt={alt}
        className={cn('h-full object-center object-contain')}
      />
    </div>
  );
}

const OurSponsors = () => {
  return (
    <div className="bg-[#fcfcfc]">
      <div className="w-full md:max-w-[1500px] mx-auto py-32 md:py-80 px-24">
        <div className="container flex flex-col gap-52">
          <div className="w-full flex md:flex-row flex-col gap-3 items-center justify-between">
            <div>
              <h1 className="font-bold text-xl md:text-5xl">Our sponsors</h1>
              <p className="font-medium text-base pt-3 md:text-xl">
                Meet our present sponsors
              </p>
            </div>
            <Link
              href="https://wa.me/2348136023230?text=I'm%20ready%20to%20power%20the%20future%20of%20tech%20at%20DevFest%20Ibadan%202025.%20I%20would%20like%20to%20inquire%20about%20sponsorship%20opportunities%21%20Let's%20connect%20to%20build%20something%20great."
              target="_blank"
            >
              <Button className="text-sm md:text-xl rounded-[100px] bg-black text-white hover:bg-core-blue hover:border border-solid border-black px-20 md:px-52 py-4 md:py-10 flex items-center">
                Apply to Sponsor <ArrowUpRight />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-24 overflow-hidden">
            <SponsorImage
              imageSrc={google}
              alt="Google"
              divClassName="bg-white p-5 md:p-10 border-[1px] border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px]"
            />
            <SponsorImage
              imageSrc={codemagic}
              alt="Codemagic"
              divClassName="bg-white p-5 md:p-10 border-[1px] border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px]"
            />
            <SponsorImage
              imageSrc={ton}
              alt="Ton Society"
              divClassName="bg-white p-5 md:p-10 border-[1px] border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px]"
            />
            <SponsorImage
              imageSrc={interswitch}
              alt="Interswitch"
              divClassName="bg-white p-5 md:p-10 border-[1px] border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px]"
            />
            <SponsorImage
              imageSrc={github}
              alt="Github Campus"
              divClassName="bg-white p-5 md:p-10 border-[1px] border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px]"
            />
            <SponsorImage
              imageSrc={lorry}
              alt="Lorry Project"
              divClassName="bg-white p-5 md:p-10 border-[1px] border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px]"
            />
            <SponsorImage
              imageSrc={oneapp}
              alt="OneApp"
              divClassName="bg-white p-5 md:p-10 border-[1px] border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px]"
            />
          </div>

          <div className="">
            <h1 className="font-bold text-xl md:text-3xl pb-5">
              Meet our past sponsors
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-24 overflow-hidden">
              <SponsorImage
                imageSrc={turing}
                alt="Turing"
                divClassName="bg-white p-5 md:p-10 border-[1px] border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px]"
              />
              <SponsorImage
                imageSrc={altschool}
                alt="AltSchool"
                divClassName="bg-white p-5 md:p-10 border-[1px] border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px]"
              />
              <SponsorImage
                imageSrc={cardify}
                alt="Cardify"
                divClassName="bg-white p-5 md:p-10 border-[1px] border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px]"
              />
              <SponsorImage
                imageSrc={digitalocean}
                alt="DigitalOcean"
                divClassName="bg-white p-5 md:p-10 border-[1px] border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px]"
              />
              <SponsorImage
                imageSrc={youverify}
                alt="YouVerify"
                divClassName="bg-white p-5 md:p-10 border-[1px] border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px]"
              />
              <SponsorImage
                imageSrc={heyfood}
                alt="Heyfood"
                divClassName="bg-white p-5 md:p-10 border-[1px] border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px]"
              />
              <SponsorImage
                imageSrc={ship}
                alt="Ship"
                divClassName="bg-white p-5 md:p-10 border-[1px] border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px]"
              />
              <SponsorImage
                imageSrc={halal}
                alt="Halal"
                divClassName="bg-white p-5 md:p-10 border-[1px] border-[#f0f0f0] rounded-2xl h-[100px] md:h-[200px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurSponsors;
