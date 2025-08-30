'use client';
import BigAsterik from '@/public/Asterik.png';
import UpCloud from '@/public/UpCloud.png';
import Image from 'next/image';
import { Calendar } from '../_module/components/icons';
import Skills from '../_module/components/animations/Skills/Skills';

const Inclusivity = () => {
  return (
    <>
      <div className="bg-pastel-blue">
        <div className="flex flex-row items-center justify-between">
          <Image
            src={UpCloud}
            alt="UpCloud"
            className="w-[100px] md:w-[200px]"
          />
          <Image
            src={BigAsterik}
            alt="asterik"
            className="pr-24 w-[90px] md:w-[150px]"
          />
        </div>
        <div className="container w-full md:max-w-[1500px] m-auto px-24 -mt-52">
          <section className="flex gap-5 flex-col items-center py-24">
            <h1 className="text-5xl font-bold text-center">
              The Future is Here. And It&lsquo;s For Everybody 🚀
            </h1>
            <p className="text-xl font-extralight text-[#4D4D4D] text-center md:w-[1000px]">
              Whether you&lsquo;re just starting your tech journey or
              you&lsquo;re a seasoned expert, DevFest Ibadan 2025 is the perfect
              place to connect, learn, and grow. Join us for a two-day main
              event and four weeks of specialized pre-DevFest workshops designed
              to meet you wherever you are on your path.
            </p>
            {/* <div className="flex flex-col md:flex-row items-center gap-4">
              <Calendar />
              <p className="font-bold text-xl w-[320px] text-center md:text-left">
                November 28th & 29th 2025, and join us by 8:00 AM prompt{' '}
              </p>
            </div> */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Calendar />
              <div className="text-center md:text-left">
                <p className="font-bold text-xl w-[320px]">
                  November 28th, 29th and
                </p>
                <p className="font-bold text-xl w-[320px]">
                  join us by 8:00 AM prompt
                </p>
              </div>
            </div>

            <p className="text-xl text-center">
              Mark your calendar for a day filled with{' '}
              <span className="text-core-blue">inspiration,</span>{' '}
              <span className="text-core-red">innovation,</span>{' '}
              <span className="text-core-green">and connection.</span>
            </p>
          </section>
          <Skills />
        </div>
      </div>
    </>
  );
};

export default Inclusivity;
