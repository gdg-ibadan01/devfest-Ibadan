export type AgendaItem = {
  time: string;
  activity: string;
  duration: string;
  highlight?: boolean;
};

export const agendaData: { day1: AgendaItem[]; day2: AgendaItem[] } = {
  day1: [
    {
      time: '9:00 am - 9:30 am',
      activity: 'Arrival of Guests',
      duration: '30 mins',
    },
    {
      time: '9:30 am - 10:00 am',
      activity: 'Opening Ceremony',
      duration: '30 mins',
    },
    {
      time: '10:00 am - 10:30 am',
      activity: 'Keynote Session',
      duration: '30 mins',
    },
    {
      time: '10:30 am - 11:00 am',
      activity: 'Speaker Session 1',
      duration: '30 mins',
    },
    {
      time: '11:00 am - 11:30 am',
      activity: 'Speaker Session 2',
      duration: '30 mins',
    },
    {
      time: '12:00 pm - 01:00 pm',
      activity: 'Break/Networking',
      duration: '30 mins',
      highlight: true,
    },
    {
      time: '1:00 pm - 1:30 pm',
      activity: 'Workshop Session 1',
      duration: '30 mins',
    },
    {
      time: '1:30 pm - 2:00 pm',
      activity: 'Workshop Session 2',
      duration: '30 mins',
    },
    {
      time: '2:00 pm - 2:30 pm',
      activity: 'Panel Session',
      duration: '30 mins',
    },
    {
      time: '2:30 pm - 3:00 pm',
      activity: 'Product Demos',
      duration: '30 mins',
    },
    {
      time: '3:00 pm - 3:30 pm',
      activity: 'Hackathon Pitching',
      duration: '30 mins',
    },
    {
      time: '4:00 pm - 5:00 pm',
      activity: 'Closing Remarks',
      duration: '1 hr',
    },
  ],
  day2: [
    {
      time: '9:00 am - 9:30 am',
      activity: 'Arrival of Guests',
      duration: '30 mins',
    },
    {
      time: '9:30 am - 10:00 am',
      activity: 'Workshop Session 3',
      duration: '30 mins',
    },
    {
      time: '10:00 am - 10:30 am',
      activity: 'Workshop Session 4',
      duration: '30 mins',
    },
    {
      time: '10:30 am - 11:00 am',
      activity: 'Speaker Session 3',
      duration: '30 mins',
    },
    {
      time: '11:00 am - 11:30 am',
      activity: 'Speaker Session 4',
      duration: '30 mins',
    },
    {
      time: '12:00 pm - 01:00 pm',
      activity: 'Break/Networking',
      duration: '30 mins',
      highlight: true,
    },
    {
      time: '1:00 pm - 2:00 pm',
      activity: 'Hackathon Presentations',
      duration: '1 hr',
    },
    {
      time: '2:00 pm - 3:00 pm',
      activity: 'Panel Session 2',
      duration: '1 hr',
    },
    {
      time: '3:00 pm - 4:00 pm',
      activity: 'Awards & Recognition',
      duration: '1 hr',
    },
    {
      time: '4:00 pm - 5:00 pm',
      activity: 'Closing & Networking',
      duration: '1 hr',
    },
  ],
};
