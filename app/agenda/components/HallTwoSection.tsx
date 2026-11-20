import React from 'react';
import { SingleHallRow } from '../AgendaData';

type Props = {
  data: SingleHallRow[];
};

export default function HallTwoSection({ data }: Readonly<Props>) {
  return (
    <div className="w-full">
      <div className="bg-[#FFE7A5] border-[2px] border-[#1E1E1E] p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <span className="inline-block bg-[#1E1E1E] text-white text-xs font-semibold px-2 py-0.5 rounded mr-2 mb-1">
            HALL TWO
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-[#1E1E1E]">
            🎙️ Speakers Sessions & Lightning Talks
          </h3>
          <p className="text-xs md:text-sm text-[#444] mt-0.5">
            Distributed systems, scalable African platforms, LLM inference,
            frontend evolution, motion design, and developer wellness.
          </p>
        </div>
        <div className="text-xs font-semibold text-[#1E1E1E] bg-white border border-[#1E1E1E] px-3 py-1.5 rounded-2xl self-start md:self-auto">
          8 Sessions • 1:30 PM - 4:40 PM
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, idx) => {
          const isLightning = item.session.type === 'lightning';
          return (
            <div
              key={idx}
              className={`border-[2px] border-[#1E1E1E] p-5 flex flex-col justify-between shadow-[4px_4px_0px_#1E1E1E] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#1E1E1E] transition-all ${
                isLightning ? 'bg-[#FFFBEA]' : 'bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded border border-[#1E1E1E] ${
                      isLightning
                        ? 'bg-[#FFE7A5] text-[#8C6B00]'
                        : 'bg-[#C3ECF6] text-[#1E1E1E]'
                    }`}
                  >
                    {isLightning ? '⚡ LIGHTNING TALK' : 'SPEAKER SESSION'}
                  </span>
                  <span className="text-xs font-semibold bg-[#FFF9EA] border border-[#1E1E1E] text-[#1E1E1E] px-2.5 py-1 rounded">
                    ⏱️ {item.duration}
                  </span>
                </div>

                <div className="text-xs font-bold text-[#555] mb-2 flex items-center gap-1.5">
                  <span>🕒</span>
                  <span>{item.time}</span>
                </div>

                <h4 className="text-base font-bold text-[#1E1E1E] leading-snug mb-3">
                  {item.session.schedule}
                </h4>
              </div>

              <div className="pt-3 border-t-[1.5px] border-[#E5E5E5] mt-2 flex flex-col gap-1.5">
                {item.session.speaker ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🎤</span>
                    <span className="text-xs md:text-sm font-semibold text-[#1E1E1E]">
                      {item.session.speaker}
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 italic">
                    Speaker to be announced
                  </div>
                )}

                {item.session.track && (
                  <span className="inline-block self-start text-[11px] font-medium bg-gray-100 text-[#555] px-2 py-0.5 rounded border border-gray-200">
                    {item.session.track}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
