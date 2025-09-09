export default function Organizers() {
  return (
    <>
      <main className="md:pt-[100px] pt-[80px] bg-pastel-blue mains min-h-screen ">
        {/* Use min-h-screen to ensure the section is at least the full height of the viewport */}
        <div className="bg-[url('/organizer_mobile.png')] organizer-bg md:bg-[url('/Team.png')] sm :min-h-[94vh] min-h-screen bg-cover bg-center flex items-center justify-center 3xl:bg-contain bg-no-repeat mb-[-10px] md:mb-0">
          <div className="w-full md:max-w-[1500px] mx-auto bottom-[7rem] md:bottom-[8rem] relative z-10">
            <div className="flex gap-4 md:gap-7 flex-col items-center text-centerjustify-between">
              <h1 className="font-bold leading-[38px] md:leading-[62px] text-[24px] md:text-[52px]">
                Meet the Organisers
              </h1>
              <p className="text-[#4D4D4D] w-[311px] leading-[22px] md:leading-[38px] text-[14px] md:text-2xl text-center md:w-[1000px]">
                Behind every great event is a dedicated team of passionate
                individuals, and DevFest 2025 is no exception. Meet the
                organizers who are working tirelessly to bring this incredible
                event to life. Get to know the people who share your passion for
                technology and innovation and learn about their commitment to
                fostering a thriving tech community.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
