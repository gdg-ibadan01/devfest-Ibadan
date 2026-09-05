import { AgendaRow } from './AgendaTable';

interface TableData {
  title: string;
  rows: AgendaRow[];
}

export const PRE_DEV_FEST_TABLES: TableData[] = [
  {
    title: 'OCT 25, 2026 RoadToDevFest (Mobile and Cybersecurity)',
    rows: [
      { time: '10:00 am - 10:45 am', activity: 'Registration & Arrival' },
      { time: '10:45 am - 11:00 am', activity: 'Introduction/Opening' },
      { time: '11:00 am - 12:30 pm', activity: 'Session 1' },
      { time: '12:30 pm - 12:45 pm', activity: 'Break and Networking' },
      { time: '12:45 pm - 02:15 pm', activity: 'Session 2' },
      {
        time: '02:15 pm - 03:00 pm',
        activity: 'Break, Networking and Pictures',
      },
      { time: '03:00 pm - 04:00 pm', activity: 'Session 3' },
      { time: '04:00 pm - 04:15 pm', activity: 'Closing Remarks' },
    ],
  },
  {
    title:
      'OCT 26, 2026 RoadToDevFest: Cybersecurity - Cybersecurity (SunnyTech Society)',
    rows: [
      { time: '10:30 am - 10:45 am', activity: 'Registration & Arrival' },
      { time: '10:45 am - 11:00 am', activity: 'Introduction/Opening' },
      { time: '11:00 am - 12:30 pm', activity: 'Session 1' },
      { time: '12:30 pm - 12:45 pm', activity: 'Break and Networking' },
      { time: '12:45 pm - 02:15 pm', activity: 'Session 2' },
      {
        time: '02:15 pm - 02:30 pm',
        activity: 'Break, Networking and Pictures',
      },
      { time: '02:30 pm - 04:00 pm', activity: 'Session 3' },
      { time: '04:00 pm - 04:15 pm', activity: 'Closing Remarks' },
    ],
  },
  {
    title:
      'OCT 26, 2026 RoadToDevFest: Cybersecurity - The Bankers (SafetyNet Society)',
    rows: [
      { time: '10:30 am - 10:45 am', activity: 'Registration & Arrival' },
      { time: '10:45 am - 11:00 am', activity: 'Introduction/Opening' },
      { time: '11:00 am - 12:30 pm', activity: 'Session 1' },
      { time: '12:30 pm - 12:45 pm', activity: 'Break and Networking' },
      { time: '12:45 pm - 02:15 pm', activity: 'Session 2' },
      {
        time: '02:15 pm - 02:30 pm',
        activity: 'Break, Networking and Pictures',
      },
      { time: '02:30 pm - 04:00 pm', activity: 'Session 3' },
      { time: '04:00 pm - 04:15 pm', activity: 'Closing Remarks' },
    ],
  },
  {
    title: 'NOV 1, 2026 RoadToDevFest: Web',
    rows: [
      { time: '10:30 am - 10:45 am', activity: 'Registration & Arrival' },
      { time: '10:45 am - 11:00 am', activity: 'Introduction/Opening' },
      { time: '11:00 am - 12:30 pm', activity: 'Session 1' },
      { time: '12:30 pm - 12:40 pm', activity: 'Break and Networking' },
      { time: '12:40 pm - 02:10 pm', activity: 'Session 2' },
      {
        time: '02:10 pm - 02:30 pm',
        activity: 'Recess, Networking and Pictures',
      },
      { time: '02:30 pm - 04:00 pm', activity: 'Session 3' },
      { time: '04:00 pm - 04:15 pm', activity: 'Closing Remarks' },
    ],
  },
  {
    title: 'NOV 8, 2026 RoadToDevFest: Products',
    rows: [
      { time: '10:30 am - 10:45 am', activity: 'Registration & Arrival' },
      { time: '10:45 am - 11:00 am', activity: 'Introduction/Opening' },
      { time: '11:00 am - 12:30 pm', activity: 'Session 1' },
      { time: '12:30 pm - 12:45 pm', activity: 'Break and Networking' },
      { time: '12:45 pm - 02:15 pm', activity: 'Session 2' },
      {
        time: '02:15 pm - 02:30 pm',
        activity: 'Break, Networking and Pictures',
      },
      { time: '02:30 pm - 04:00 pm', activity: 'Session 3' },
      { time: '04:00 pm - 04:15 pm', activity: 'Closing Remarks' },
    ],
  },
];

export const FRIDAY_TABLES: TableData[] = [
  {
    title: 'OCT 25, 2026 DevFest Day 1 (Main Event Opening)',
    rows: [
      {
        time: '09:00 am - 10:00 am',
        activity: 'Registrations & Technical Setup Check',
      },
      {
        time: '10:00 am - 10:30 am',
        activity: 'Day 1 Keynote Opening Address',
      },
      {
        time: '10:30 am - 12:00 pm',
        activity:
          'Panel Discussion: The State of Technical Communities in Southwest Nigeria',
      },
      { time: '12:00 pm - 12:30 pm', activity: 'Recess and Networking' },
      {
        time: '12:30 pm - 02:00 pm',
        activity: 'Hands-on Coding Labs & Workshops',
      },
      { time: '02:00 pm - 03:00 pm', activity: 'Lunch Break & Booth Visits' },
      {
        time: '03:00 pm - 04:30 pm',
        activity: 'Breakout Sessions (Frontend, Backend, AI)',
      },
      { time: '04:30 pm - 05:00 pm', activity: 'Day 1 Closing Announcements' },
    ],
  },
];

export const SATURDAY_TABLES: TableData[] = [
  {
    title: 'OCT 26, 2026 DevFest Day 2 (Keynotes & Main Tracks)',
    rows: [
      { time: '08:30 am - 09:00 am', activity: 'Registrations and Arrival' },
      { time: '09:00 am - 09:15 am', activity: 'Introduction/Opening Speech' },
      {
        time: '09:15 am - 09:40 am',
        activity:
          'Keynote Speech 1 - The Evolution of Hello World: Reimagining Development for AI',
      },
      { time: '09:40 am - 09:50 am', activity: 'Interactive Games' },
      {
        time: '09:55 am - 10:20 am',
        activity: 'Keynote Speech 2 - Securing the Digital Citizen',
      },
      { time: '10:20 am - 10:30 am', activity: 'Transfer Between Halls' },
      {
        time: '10:35 am - 12:00 pm',
        activity: 'Advanced Cloud, AI & Security Sessions',
      },
      {
        time: '12:00 pm - 12:20 pm',
        activity: 'Sponsor Presentation & Giveaways',
      },
      {
        time: '12:25 pm - 01:50 pm',
        activity: 'Workshop Sessions (Design Systems, Agentic AI)',
      },
      {
        time: '01:50 pm - 02:45 pm',
        activity: 'Lightening Talks & Community Showcases',
      },
      {
        time: '02:45 pm - 03:15 pm',
        activity: 'Networking, Booth Visits, Pictures, and Item 7',
      },
      {
        time: '03:20 pm - 04:20 pm',
        activity: 'Panel Session - Building for Resilience in Tech',
      },
      {
        time: '04:20 pm - 05:00 pm',
        activity: 'Closing Keynotes & Vote of Thanks',
      },
    ],
  },
];
