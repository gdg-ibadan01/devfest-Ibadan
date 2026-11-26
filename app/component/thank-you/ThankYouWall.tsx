import Image, { type StaticImageData } from 'next/image';
import { ORGANIZERS_DATA } from '@/app/organizers/organizers';
import { speakersData } from '@/app/_module/data/meet-our-speakers.data';
import { THANK_YOU } from '@/app/_module/data/thank-you.data';

function Group({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 border-t-2 border-[#1a1a1a] py-10">
      <div className="max-w-[720px]">
        <h3 className="font-grotesk text-[28px] font-bold leading-[1.2] sm:text-[36px]">
          {title}
        </h3>
        <p className="mt-2 text-[16px] leading-[1.6] text-[#4a4a4a]">{text}</p>
      </div>
      {children}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function Person({
  name,
  note,
  src,
}: {
  name: string;
  note?: string;
  src?: string | StaticImageData;
}) {
  return (
    <li className="flex flex-col items-center gap-2 text-center">
      <span className="relative flex h-[84px] w-[84px] items-center justify-center overflow-hidden rounded-[50%] border-2 border-[#1a1a1a] bg-[#FBBC04] font-grotesk text-[24px] font-black sm:h-[100px] sm:w-[100px]">
        {src ? (
          <Image
            src={src}
            alt=""
            fill
            sizes="100px"
            className="object-cover object-top"
          />
        ) : (
          <span aria-hidden="true">{initials(name)}</span>
        )}
      </span>
      <span className="text-[14px] font-semibold leading-[1.3]">{name}</span>
      {note ? <span className="text-[12px] text-[#4a4a4a]">{note}</span> : null}
    </li>
  );
}

export default function ThankYouWall() {
  const g = THANK_YOU.groups;
  return (
    <section
      id="thank-you-wall"
      aria-labelledby="wall-heading"
      className="bg-[#FBF5E2] font-inter text-[#1a1a1a]"
    >
      <div className="mx-auto max-w-[1100px] px-4 py-[64px] sm:px-6 lg:py-[96px]">
        <h2
          id="wall-heading"
          className="font-grotesk text-[36px] font-black leading-[1.1] sm:text-[56px]"
        >
          To everyone who made it happen
        </h2>

        <Group title={g.speakers.title} text={g.speakers.text}>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
            {speakersData.map((s) => (
              <Person
                key={s.name}
                name={s.name}
                note={s.sessionType}
                src={s.image}
              />
            ))}
          </ul>
        </Group>

        <Group title={g.organizers.title} text={g.organizers.text}>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
            {ORGANIZERS_DATA.map((o) => (
              <Person key={o.name} name={o.name} note={o.role} src={o.image} />
            ))}
          </ul>
        </Group>

        <Group title={g.volunteers.title} text={g.volunteers.text}>
          {g.volunteers.names.length ? (
            <ul className="flex flex-wrap gap-2">
              {g.volunteers.names.map((n) => (
                <li
                  key={n}
                  className="rounded-[100px] border border-[#1a1a1a] bg-white px-4 py-1.5 text-[14px]"
                >
                  {n}
                </li>
              ))}
            </ul>
          ) : null}
        </Group>

        <Group title={g.attendees.title} text={g.attendees.text} />
      </div>
    </section>
  );
}
