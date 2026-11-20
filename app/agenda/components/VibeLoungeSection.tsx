import React from 'react';
import { SingleHallRow } from '../AgendaData';

type Props = {
  data: SingleHallRow[];
};

export default function VibeLoungeSection({ data }: Readonly<Props>) {
  return (
    <div className="w-full">
      <div className="bg-[#F8D8D8] border-[2px] border-[#1E1E1E] p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <span className="inline-block bg-[#1E1E1E] text-white text-xs font-semibold px-2 py-0.5 rounded mr-2 mb-1">
            HALL FOUR
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-[#1E1E1E]">
            💻 The Vibe Lounge
          </h3>
          <p className="text-xs md:text-sm text-[#444] mt-0.5">
            Interactive build lounge — 100 builders every hour, live creation
            &amp; collaboration.
          </p>
        </div>
        <div className="text-xs font-semibold text-[#1E1E1E] bg-white border border-[#1E1E1E] px-3 py-1.5 rounded-2xl self-start md:self-auto">
          1:30 PM - 4:55 PM
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((item, idx) => {
          const isNetworking = item.session.schedule
            .toLowerCase()
            .includes('networking');
          return (
            <div
              key={idx}
              className={`border-[2px] border-[#1E1E1E] p-4 flex flex-col justify-between shadow-[4px_4px_0px_#1E1E1E] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#1E1E1E] ${
                isNetworking ? 'bg-[#FFF9EA]' : 'bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded border border-[#1E1E1E] ${
                      isNetworking ? 'bg-[#FFE7A5]' : 'bg-[#F8D8D8]'
                    }`}
                  >
                    {isNetworking ? 'CONNECT' : `SESSION 0${idx + 1}`}
                  </span>
                  <span className="text-[11px] font-semibold bg-gray-100 border border-gray-300 px-2 py-0.5 rounded">
                    {item.duration}
                  </span>
                </div>

                <div className="text-xs font-semibold text-[#666] mb-2 flex items-center gap-1">
                  <span>🕒</span>
                  <span>{item.time}</span>
                </div>

                <h4 className="text-base font-bold text-[#1E1E1E] mb-2">
                  {isNetworking ? '🤝 ' : '⚡ '}
                  {item.session.schedule}
                </h4>
              </div>

              <div className="pt-2 border-t border-gray-200 mt-2">
                {item.session.speaker ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">Speaker:</span>
                    <span className="text-xs font-bold text-[#1E1E1E]">
                      {item.session.speaker}
                    </span>
                  </div>
                ) : (
                  <p className="text-[11px] text-[#666]">
                    Open floor networking across all tracks
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
