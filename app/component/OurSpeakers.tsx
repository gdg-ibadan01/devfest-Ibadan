'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../_module/components/ui/button';
import { SpeakersList } from '../_module/data/speakers-list';
import IconsArt from './IconsArt';

const OurSpeakers = () => {
  const Speakers = SpeakersList.slice(0, 4);
  return (
    <>
      <div className="bg-[#fcfcfc] w-full">
        <div className="w-full md:max-w-[1500px] mx-auto py-32 md:py-80">
          <div className="container flex flex-col gap-5 md:gap-52">
            <h1 className="text-2xl md:text-6xl font-bold">
              Meet our amazing speakers
            </h1>
            <div className="flex flex-row gap-2 md:gap-5">
              <Link href="/speakers">
                <Button className="text-sm md:text-xl rounded-[100px] hover:bg-core-blue px-20 md:px-52 py-4 md:py-10 flex items-center">
                  View All <ArrowUpRight />
                </Button>
              </Link>
            </div>
            {/* <section className="grid grid-cols-1 md:grid-cols-4 gap-24">
              {Speakers.map((data, idx) => (
                <Fragment key={idx}>
                  <SpeakerCard {...data} />
                </Fragment>
              ))}
            </section> */}
            <h1 className="text-5xl font-bold text-center">
              Speakers Coming Soon
            </h1>

            <section className="flex gap-5 flex-col items-center py-24">
              <p className="text-xl font-extralight text-[#4D4D4D] md:w-[820px] text-center">
                Our speaker lineup is almost here! Prepare to be inspired by
                industry leaders, tech innovators, and creative thinkers who
                will transform your DevFest experience.
              </p>
            </section>
          </div>
        </div>
        <IconsArt className="flex flex-col -mt-64 md:-mt-[150px]" />
      </div>
    </>
  );
};

export default OurSpeakers;
