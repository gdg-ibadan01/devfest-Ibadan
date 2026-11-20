import React from 'react';
import { HallSession } from '../AgendaData';
import SessionBadge from './SessionBadge';

type Props = {
  session?: HallSession;
};

export default function HallCell({ session }: Readonly<Props>) {
  if (!session) {
    return (
      <td className="p-3 border-[2px] border-[#1E1E1E] text-gray-300 text-sm italic align-top">
        —
      </td>
    );
  }

  return (
    <td className="p-3 border-[2px] border-[#1E1E1E] align-top bg-white text-sm">
      <SessionBadge type={session.type} />
      <p className="font-medium text-[#1E1E1E] leading-snug mb-1">
        {session.schedule}
      </p>
      {session.speaker && (
        <p className="text-[#555] text-xs">{session.speaker}</p>
      )}
      {session.track && (
        <p className="text-[#888] text-xs mt-0.5 italic">{session.track}</p>
      )}
    </td>
  );
}
