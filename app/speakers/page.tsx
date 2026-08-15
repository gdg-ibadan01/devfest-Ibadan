'use client';

import { Fragment, useState } from 'react';
import SpeakerCard, {
  TspeakerProps,
} from '../_module/components/cards/SpeakerCard';
import { SpeakersList } from '../_module/data/speakers-list';
import { speakersClass as Styles } from './speakers';
import SpeakerModal from './components/speaker-modal';
import { StaticImageData } from 'next/image';
import clsx from 'clsx';

export default function Speakers() {
  const [modal, setModal] = useState(false);
  const [speakerData, setSpeakerData] = useState<TspeakerProps>({
    name: '',
    title: '',
    src: null as unknown as StaticImageData,
  });

  const handleClick = (data: TspeakerProps) => {
    setModal(true);
    setSpeakerData(data);
  };

  return (
    <div className={clsx(Styles.container)}>
      <main className={clsx(Styles.main, '3xl:max-w-[1440px] mx-auto')}>
        {/* <section className="flex gap-5 flex-col items-center py-24">
          <h1 className="text-5xl font-bold text-center">
            Speakers Coming Soon
          </h1>
          <p className="text-xl font-extralight text-[#4D4D4D] md:w-[820px] text-center">
            Our speaker lineup is almost here! Prepare to be inspired by
            industry leaders, tech innovators, and creative thinkers who will
            transform your DevFest experience.
          </p>
        </section> */}

        <header className={Styles.header}>
          <section className={Styles.headerSection}>
            <h1 className={Styles.headerSectionHeading}>
              Meet our amazing speakers
            </h1>
            <p className={Styles.headerSectionParagraph}>
              Our speakers are industry leaders, innovative thinkers, and
              passionate tech enthusiasts who are eager to share their knowledge
              and experiences with you.{' '}
            </p>
          </section>
        </header>
        {/* <Button className={Styles.headerButton}> Apply to Speak </Button> */}
        <section className={Styles.speakersListWrapper}>
          {SpeakersList.map((data, idx) => (
            <Fragment key={idx}>
              <SpeakerCard handleClick={handleClick} {...data} />
            </Fragment>
          ))}
        </section>
      </main>
      {modal && <SpeakerModal setModal={setModal} speakerData={speakerData} />}
    </div>
  );
}
