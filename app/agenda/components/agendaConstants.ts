import { HallSession } from '../AgendaData';

export const SESSION_TYPE_STYLES: Record<HallSession['type'], string> = {
  session: 'bg-[#C3ECF6] text-[#1E1E1E]',
  lightning: 'bg-[#FFE7A5] text-[#1E1E1E]',
  workshop: 'bg-[#CCF6C5] text-[#1E1E1E]',
  vibe: 'bg-[#F8D8D8] text-[#583C3C]',
};

export const SESSION_TYPE_LABEL: Record<HallSession['type'], string> = {
  session: 'Speaker Session',
  lightning: 'Lightning Talk',
  workshop: 'Workshop',
  vibe: 'Vibe Lounge',
};

export type BreakoutFilter = 'all' | 'hall-1' | 'hall-2' | 'hall-3' | 'hall-4';

export type BreakoutFilterOption = {
  id: BreakoutFilter;
  label: string;
  activeColor: string;
};

export const BREAKOUT_FILTER_OPTIONS: readonly BreakoutFilterOption[] = [
  {
    id: 'all',
    label: '🌟 All Halls',
    activeColor: 'bg-white text-[#1E1E1E] border-white',
  },
  {
    id: 'hall-1',
    label: '🎙️ Hall 1: Speakers Sessions & Lightning Talks',
    activeColor: 'bg-[#C3ECF6] text-[#1E1E1E] border-[#C3ECF6]',
  },
  {
    id: 'hall-2',
    label: '🏛️ Hall 2: Speakers Sessions & Lightning Talks',
    activeColor: 'bg-[#FFE7A5] text-[#1E1E1E] border-[#FFE7A5]',
  },
  {
    id: 'hall-3',
    label: '🛠️ Hall 3: Workshops',
    activeColor: 'bg-[#CCF6C5] text-[#1E1E1E] border-[#CCF6C5]',
  },
  {
    id: 'hall-4',
    label: '🎧 Hall 4: Vibe Lounge',
    activeColor: 'bg-[#F8D8D8] text-[#583C3C] border-[#F8D8D8]',
  },
] as const;
