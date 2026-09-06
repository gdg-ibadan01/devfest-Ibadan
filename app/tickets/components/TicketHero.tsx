import IconsArt from '@/app/component/IconsArt';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const TicketHero = () => {
  return (
    <section className="relative bg-pastel-blue min-h-[100vh] overflow-hidden">
      <main className="container mx-auto pt-[180px] md:pt-[140px] flex flex-col items-center font-sans space-y-[32px] md:space-y-[16px]">
        <h1 className="w-full max-w-[1000px] mx-auto text-social-dark font-[900] text-[48px] md:text-[74px] text-center leading-[111.01%]">
          Your <span className="text-blue">{'{Ticket}'}</span> to DevFest 2026
          starts here
        </h1>
        <Image
          src={'/ticket_hero.png'}
          alt="Ticket hero"
          width={1000}
          height={10000}
          className="hidden md:block h-[222px] w-auto mx-auto"
        />

        <div className="flex gap-3 md:gap-5 text-sm'">
          <Link
            href="/tickets/buy"
            className="bg-black py-[17px] px-[23px] md:py-[33px] md:px-[101px] text-white hover:bg-core-blue hover:text-white rounded-[100px] flex"
          >
            Buy Ticket <ArrowUpRight />
          </Link>

          <Link
            href="/tickets/gift"
            className="bg-white py-[17px] px-[23px] md:py-[33px] md:px-[101px] border-[1px] border-black hover:border-core-blue text-black hover:bg-core-blue hover:text-white rounded-[100px]"
          >
            Gift Ticket
          </Link>
        </div>
      </main>
      <Image
        src={'/ticket_hero.png'}
        alt="Ticket hero"
        width={1000}
        height={10000}
        className="block md:hidden w-full h-auto mt-[48px]"
      />
      <IconsArt className="absolute bottom-0" showFull={false} />
    </section>
  );
};

export default TicketHero;
