import CountDown from './component/CountDown';
import DevfestHero from './component/DevfestHero';
import Inclusivity from './component/Inclusivity';
import Recap from './component/Recap';
import OurSpeakers from './component/OurSpeakers';
import Venue from './component/Venue';
import OurSponsors from './component/OurSponsors';
import OurMerch from './component/OurMerch';

export default function Home() {
  return (
    <>
      <DevfestHero />
      <Inclusivity />
      <Recap />
      <CountDown />
      <Venue />
      <OurSpeakers />
      <OurSponsors />
      <OurMerch />
    </>
  );
}
