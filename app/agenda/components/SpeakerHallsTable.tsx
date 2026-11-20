import React from 'react';
import { SpeakerHallRow, HallSession } from '../AgendaData';
import SessionBadge from './SessionBadge';

function HallCell({ session }: Readonly<{ session?: HallSession }>) {
  if (!session) {
    return (
      <td className="p-3.5 border-[2px] border-[#1E1E1E] text-gray-300 text-sm italic align-top">
        —
      </td>
    );
  }

  const isLightning = session.type === 'lightning';

  return (
    <td
      className={`p-3.5 border-[2px] border-[#1E1E1E] align-top text-sm ${isLightning ? 'bg-[#FFFBEA]' : 'bg-white'}`}
    >
      <SessionBadge type={session.type} />
      <p className="font-semibold text-[#1E1E1E] leading-snug mt-1 mb-1">
        {isLightning && <span className="mr-1">⚡</span>}
        {session.schedule}
      </p>
      {session.speaker && (
        <p className="text-[#444] text-xs font-medium mt-1">
          🎤 {session.speaker}
        </p>
      )}
      {session.track && (
        <span className="inline-block text-[11px] font-normal text-[#666] bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded mt-1.5">
          {session.track}
        </span>
      )}
    </td>
  );
}

type Props = {
  data: SpeakerHallRow[];
};

export default function SpeakerHallsTable({ data }: Readonly<Props>) {
  return (
    <div className="w-full">
      <div className="bg-[#C3ECF6] border-[2px] border-[#1E1E1E] p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <span className="inline-block bg-[#1E1E1E] text-white text-xs font-semibold px-2 py-0.5 rounded mr-2 mb-1">
            HALL ONE &amp; HALL TWO
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-[#1E1E1E]">
            🎙️ Speaker Sessions &amp; Lightning Talks
          </h3>
          <p className="text-xs md:text-sm text-[#444] mt-0.5">
            Concurrent tracks: Full speaker sessions (25 mins) &amp; rapid
            lightning talks (10 mins).
          </p>
        </div>
        <div className="text-xs font-semibold text-[#1E1E1E] bg-white border border-[#1E1E1E] px-3 py-1.5 rounded-2xl self-start md:self-auto">
          1:30 PM – 4:55 PM
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full border-[2px] border-[#1E1E1E] border-collapse min-w-[650px]">
          <thead className="bg-white">
            <tr>
              <th className="p-3 text-left border-[2px] border-[#1E1E1E] font-bold text-sm md:text-base w-[140px] md:w-[170px]">
                Time
              </th>
              <th className="p-3 text-left border-[2px] border-[#1E1E1E] font-bold text-sm md:text-base">
                Hall One
                <span className="block text-xs font-normal text-gray-600">
                  Speakers Sessions & Lightning Talks
                </span>
              </th>
              <th className="p-3 text-left border-[2px] border-[#1E1E1E] font-bold text-sm md:text-base">
                Hall Two
                <span className="block text-xs font-normal text-gray-600">
                  Speakers Sessions & Lightning Talks
                </span>
              </th>
              <th className="p-3 text-left border-[2px] border-[#1E1E1E] font-bold text-sm md:text-base w-[90px] md:w-[110px]">
                Duration
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              const isLightningRow =
                row.hallOne?.type === 'lightning' ||
                row.hallTwo?.type === 'lightning';
              return (
                <tr
                  key={i}
                  className={isLightningRow ? 'bg-[#FFFBEA]' : 'bg-white'}
                >
                  <td className="p-3.5 border-[2px] border-[#1E1E1E] whitespace-nowrap font-medium text-xs md:text-sm align-top">
                    <span>{row.time}</span>
                    {isLightningRow && (
                      <span className="block text-[11px] text-[#B8860B] font-semibold mt-0.5">
                        ⚡ Lightning Talk
                      </span>
                    )}
                  </td>
                  <HallCell session={row.hallOne} />
                  <HallCell session={row.hallTwo} />
                  <td className="p-3.5 border-[2px] border-[#1E1E1E] whitespace-nowrap text-xs md:text-sm align-top font-medium">
                    {row.duration}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 p-3 bg-gray-50 border border-gray-200 text-xs text-gray-600 rounded">
        💡 <strong>Note:</strong> Hall One and Hall Two run back-to-back.
        Q&amp;A is included within each session slot.
      </div>
    </div>
  );
}
