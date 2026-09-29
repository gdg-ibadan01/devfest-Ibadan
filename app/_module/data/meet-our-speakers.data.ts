export interface SpeakerItem {
  id: string | number;
  name: string;
  role: string;
  image: string;
  colorScheme: 'blue' | 'yellow' | 'green' | 'pink';
}

export const defaultSpeakers: SpeakerItem[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Senior Engineer at Google',
    image: '/speakerimg.jpg',
    colorScheme: 'blue',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Senior Engineer at Google',
    image: '/speakerimg.jpg',
    colorScheme: 'yellow',
  },
  {
    id: 3,
    name: 'Sarah Chen',
    role: 'Senior Engineer at Google',
    image: '/speakerimg.jpg',
    colorScheme: 'green',
  },
  {
    id: 4,
    name: 'Sarah Chen',
    role: 'Senior Engineer at Google',
    image: '/speakerimg.jpg',
    colorScheme: 'pink',
  },
];
