import Image from 'next/image';
import { ORGANIZERS_DATA } from './organizers';

export default function Organizers() {
  return (
    <>
      <main className="md:pt-[150px] pt-[100px] pb-[100px] bg-white min-h-screen">
        <div className="w-full max-w-[1500px] mx-auto px-6 md:px-12">
          {/* Header Section */}
          <div className="flex gap-4 md:gap-6 flex-col items-center text-center justify-between mb-16 max-w-5xl mx-auto">
            <h1 className="font-bold leading-[38px] md:leading-[62px] text-[28px] md:text-[52px] text-black">
              Meet the Organisers
            </h1>
            <p className="text-[#4D4D4D] leading-[22px] md:leading-[32px] text-[14px] md:text-[18px] text-center max-w-[900px]">
              Behind every great event is a dedicated team of passionate
              individuals, and DevFest 2025 is no exception. Meet the organizers
              who are working tirelessly to bring this incredible event to life.
              Get to know the people who share your passion for technology and
              innovation and learn about their commitment to fostering a
              thriving tech community.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {ORGANIZERS_DATA.map((org, index) => (
              <div
                key={index}
                className={`flex flex-col justify-between overflow-hidden ${org.bgColor} transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="pt-6 px-6 pb-2 flex flex-col items-start gap-2">
                  <h2 className="text-xl md:text-[22px] font-bold text-black tracking-tight leading-tight">
                    {org.name}
                  </h2>
                  <span className="border-2 border-black px-[15px] py-[4px] rounded-[32px] text-xs font-semibold text-black bg-transparent select-none">
                    {org.role}
                  </span>
                </div>
                <div className="relative w-full md:-mt-[50px] lg:-mt-[100px] flex items-end">
                  <Image
                    src={org.image}
                    alt={org.name}
                    width={400}
                    height={500}
                    className="w-full h-full object-contain object-bottom select-none"
                    priority={index < 5}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
