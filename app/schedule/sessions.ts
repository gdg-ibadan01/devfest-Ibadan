import {
  day1ClosingData,
  day1HallFourData,
  day1HallOneData,
  day1HallThreeData,
  day1HallTwoData,
  day1PlenaryData,
  type SingleHallRow,
} from '../agenda/AgendaData';
import type { ConciergeSession } from './pick';

const NO_TOPIC = [
  "Introduction — Organizer's Speech",
  'Session',
  'Project Showcase',
];

const fromHall = (rows: SingleHallRow[], hall: string) =>
  rows
    .filter((r) => r.session.schedule !== 'Networking')
    .map((r) => ({
      title: r.session.schedule,
      speaker: r.session.speaker,
      track:
        r.session.type === 'vibe'
          ? 'Interactive build lounge: attendees build projects live and collaborate'
          : r.session.track,
      type: r.session.type,
      hall,
      time: r.time,
    }));

// Every talk, workshop and lounge slot an attendee can choose; breaks and sponsor slots are left out.
export const CONCIERGE_SESSIONS: ConciergeSession[] = [
  ...[...day1PlenaryData, ...day1ClosingData]
    // Items with no topic (organizer intro, untitled "Session", showcase) give Jev nothing to judge.
    .filter((p) => p.type !== 'break' && !NO_TOPIC.includes(p.schedule))
    .map((p) => ({
      title: p.schedule,
      speaker: p.speaker?.replace(/^(Speaker|Host):\s*/, ''),
      track: undefined,
      type: 'session' as const,
      hall: 'Main Hall',
      time: p.time,
    })),
  ...fromHall(day1HallOneData, 'Hall 1'),
  ...fromHall(day1HallTwoData, 'Hall 2'),
  ...fromHall(day1HallThreeData, 'Hall 3 · Workshops'),
  ...fromHall(day1HallFourData, 'Hall 4 · Vibe Lounge'),
].map((s, i) => ({ ...s, id: `s${i}` }));
