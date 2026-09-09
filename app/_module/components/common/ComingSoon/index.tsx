import IconsArt from '@/app/component/IconsArt';
import { ReactElement } from 'react';

interface ComingSoonProps {
  page: string;
  subtitle?: string | ReactElement;
  fullArt?: boolean;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  page,
  subtitle,
  fullArt = false,
}) => {
  return (
    <div className="w-full h-screen 3xl:h-[80vh] pt-[150px] 3xl:pt-0 relative">
      <div className="h-full bg-no-repeat bg-top bg-cover flex flex-col justify-between md:justify-center 3xl:justify-center ">
        <div className="h-fit w-full md:max-w-[1500px] mx-auto mt-52">
          <div className="container flex gap-14 md:gap-7 flex-col items-center justify-between">
            <h1 className="font-bold text-5xl text-center">
              {page} Coming Soon
            </h1>
            <p className="text-[#4D4D4D] text-2xl text-center md:w-[850px]">
              {subtitle || (
                <>
                  We&apos;re crafting an agenda packed with insightful talks,
                  hands-on workshops, and networking opportunities just for you.
                  Stay tuned—our full schedule will be revealed soon!
                </>
              )}
            </p>

            {/* <Link href="https://devfestibadan.com" target="_blank">
              <Button className="text-sm md:text-xl rounded-[100px] bg-black text-white hover:bg-core-blue px-20 md:px-52 py-4 md:py-10 hidden md:flex items-center">
                Notify Me
                <ArrowUpRight />
              </Button>
            </Link> */}
          </div>
        </div>
        {/* <IconsArt_S className="" /> */}
        <div className="relative bottom-0 3xl:absolute 3xl:bottom-0 3xl:right-0 3xl:left-0">
          <IconsArt showFull={fullArt} />
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
