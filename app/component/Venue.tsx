import venue from '@/public/venue-home.jpg';
import venuee from '@/public/venue-home-2.jpg';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import IconsArt_S from './IconsArt_S';
import { Button } from '../_module/components/ui/button';

const Venue = () => {
  return (
    <>
      <div className="bg-pastel-red">
        <div className="w-full md:max-w-[1500px] mx-auto py-32 md:pt-100 md:pb-0">
          <div className="container flex flex-col md:flex-row gap-14">
            <div className="w-full md:w-1/3 flex flex-col gap-10">
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <Image
                      src={venue}
                      alt="venue"
                      className="w-full rounded-3xl"
                    />
                  </div>
                  <div className="flip-card-back">
                    <p className="text-xl text-left leading-7 tracking-wider">
                      Kakanfo Inn & Conference Center - Kakanfo Inn & Conference
                      Center. Kakanfo Inn & Conference Center - Kakanfo Inn &
                      Conference Center.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3 flex flex-col gap-10">
              <div className="flex flex-row items-center justify-between">
                <h1 className="font-bold text-2xl md:text-5xl">The venue</h1>
                <Link
                  href="https://gdg.community.dev/events/details/google-gdg-ibadan-presents-devfest-ibadan-2024/"
                  target="_blank"
                >
                  <Button className="text-sm md:text-xl rounded-[100px] bg-black text-white hover:bg-core-blue px-20 md:px-52 py-4 md:py-10 hidden md:flex items-center">
                    Get Ticket
                    <ArrowUpRight />
                  </Button>
                </Link>

                <Link
                  href="https://gdg.community.dev/events/details/google-gdg-ibadan-presents-devfest-ibadan-2024/"
                  target="_blank"
                  className="block md:hidden p-5 md:px-52 border-[1px] border-black bg-black text-white hover:bg-core-blue hover:text-white rounded-full"
                >
                  <ArrowUpRight />
                </Link>
              </div>
              <Image
                src={venuee}
                alt="venue"
                className="w-full rounded-3xl max-h-[700px] object-center z-10"
              />
            </div>
          </div>
        </div>
        <IconsArt_S className="hidden md:flex flex-col -mt-124" />
      </div>
    </>
  );
};

export default Venue;
