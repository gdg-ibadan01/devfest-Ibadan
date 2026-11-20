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

export type BreakoutFilter = 'all' | 'speakers' | 'workshops' | 'vibe';

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
    id: 'speakers',
    label: '🎙️ Halls 1 & 2 (Speakers)',
    activeColor: 'bg-[#C3ECF6] text-[#1E1E1E] border-[#C3ECF6]',
  },
  {
    id: 'workshops',
    label: '🛠️ Hall 3 (Workshops)',
    activeColor: 'bg-[#CCF6C5] text-[#1E1E1E] border-[#CCF6C5]',
  },
  {
    id: 'vibe',
    label: '🎧 Hall 4 (Vibe Lounge)',
    activeColor: 'bg-[#F8D8D8] text-[#583C3C] border-[#F8D8D8]',
  },
] as const;
