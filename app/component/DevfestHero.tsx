'use client';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import IconsArt from './IconsArt';

import { useRef, useEffect } from 'react';
import Image from 'next/image';

const DevfestHero = () => {
  const sectionRef = useRef(null);

  const wrapLetters = (text: string) =>
    text.split('').map((char, index) => (
      <span
        key={index}
        className="letter"
        style={{ animationDelay: `${0.05 * index}s` }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));

  useEffect(() => {
    const currentSection = sectionRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.5 }
    );

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);
  return (
    <main ref={sectionRef} className="pt-[150px] bg-pastel-yellow ">
      <div className="w-full md:max-w-[1500px] mx-auto relative z-10">
        <header className="container headers flex gap-4 md:gap-7 flex-col items-center justify-between">
          <h1 className="font-bold text-[2rem] leading-[2.5rem] md:text-8xl">
            Devfest Ibadan
          </h1>

          <Image
            width={1000}
            height={1000}
            src={'/homehero_img.png'}
            alt="Devfest Ibadan Ticket"
            className="w-full md:max-w-[820px] h-auto object-contain"
          />
          <div className="flex flex-col md:flex-row gap-3 md:gap-5 text-sm'">
            <Link
              href="/rsvp"
              className="bg-black py-4 md:py-[33px] px-52 md:px-[106px] text-white hover:bg-core-blue hover:text-white rounded-[100px] flex items-center justify-center"
            >
              RSVP <ArrowUpRight />
            </Link>

            <Link
              href="#"
              className="bg-white py-4 md:py-[33px] px-52 md:px-[106px] border-[1px] border-black hover:border-core-blue text-black hover:bg-core-blue hover:text-white rounded-[100px]"
            >
              Apply to Speak
            </Link>
          </div>
        </header>
      </div>
      <IconsArt className="-mt-[150px] w-full" />
    </main>
  );
};

export default DevfestHero;
