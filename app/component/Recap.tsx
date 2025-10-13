'use client';
import Image from 'next/image';
import { recapImages } from '../_module/data/recap-images';
import IconsArt from './IconsArt';

const Recap = () => {
  return (
    <>
      <div className="bg-pastel-green">
        <div className="w-full md:max-w-[1500px] mx-auto pt-80 md:pt-124">
          <div className="container">
            <div className="flex flex-row justify-between items-center mb-5 gap-3">
              <h1 className="font-bold text-2xl md:text-3xl">
                Recap of past events
              </h1>
            </div>

            <div className="scroll-container overflow-hidden relative">
              <div className="scrolling-wrapper flex gap-10">
                {recapImages.map((each, idx) => (
                  <Image
                    key={idx}
                    src={each}
                    alt="devfest recap"
                    className="h-[430px] w-[405px] object-cover rounded-xl"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <IconsArt className="flex flex-col -mt-[200px] md:-mt-[390px]" />
      </div>

      <style jsx>{`
        .scroll-container {
          width: 100%;
        }

        .scrolling-wrapper {
          animation: scroll-horizontal 30s linear infinite;
        }

        @keyframes scroll-horizontal {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </>
  );
};

export default Recap;
