'use client';

import { FC } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';

interface AgendaTrackHighlight {
  tag: string;
  room: string;
  time: string;
  title: string;
  description: string;
  sessions: string[];
  colorScheme: {
    border: string;
    badgeBg: string;
    badgeText: string;
    accentDot: string;
  };
}

const agendaHighlights: AgendaTrackHighlight[] = [
  {
    tag: 'MORNING PLENARY',
    room: 'Main Hall',
    time: '8:30 AM - 1:30 PM',
    title: 'Keynotes & Panel Sessions',
    description:
      'Kick off the day with government digital leaders, visionary keynote speakers, founder panels, and sponsor showcases.',
    sessions: [
      'Keynote: How AI & Digital Innovation Transform Governance',
      'Keynote II: Built to Last — Future-Proof Tech Careers',
      'Panel Session: Founders on Building for Scale',
    ],
    colorScheme: {
      border: 'border-[#4285F4]',
      badgeBg: 'bg-[#D2E3FC]',
      badgeText: 'text-[#1967D2]',
      accentDot: 'bg-[#4285F4]',
    },
  },
  {
    tag: 'SPEAKER TRACKS',
    room: 'Hall One & Hall Two',
    time: '1:30 PM - 4:55 PM',
    title: 'Sessions & Lightning Talks',
    description:
      'Dual breakout stages with 25-minute deep-dives and 10-minute lightning talks across every modern developer domain.',
    sessions: [
      'Next-Gen Web3 Apps with AI Agents',
      'Multimodal Flutter Across Platforms',
      'Engineering LLM Inference & Nano-vLLM',
    ],
    colorScheme: {
      border: 'border-[#FBBC04]',
      badgeBg: 'bg-[#FFF0C2]',
      badgeText: 'text-[#B06000]',
      accentDot: 'bg-[#FBBC04]',
    },
  },
  {
    tag: 'HANDS-ON LABS',
    room: 'Hall Three',
    time: '1:30 PM - 4:25 PM',
    title: 'In-Depth Code Workshops',
    description:
      'Intensive 45-minute code-along workshops where you build, deploy, and review production-grade applications.',
    sessions: [
      'Multi-Agent AI Systems with PyTorch & State Graphs',
      'AI Code Review with Antigravity CLI and SDK',
      'RAG AI Agents in Streamlit on Google Cloud Run',
    ],
    colorScheme: {
      border: 'border-[#34A853]',
      badgeBg: 'bg-[#CEEAD6]',
      badgeText: 'text-[#0D652D]',
      accentDot: 'bg-[#34A853]',
    },
  },
  {
    tag: 'LIVE BUILD & CHILL',
    room: 'Hall Four',
    time: '1:30 PM - 4:55 PM',
    title: 'The Vibe Lounge',
    description:
      'An interactive space where 100 builders per session create real-world apps with live music, collaboration, and networking.',
    sessions: [
      'Live App Building with Jesutoni Aderibigbe',
      'Build Sessions with Abidemi Tiamiyu & Joshua',
      'Cross-Track Community Networking',
    ],
    colorScheme: {
      border: 'border-[#EA4335]',
      badgeBg: 'bg-[#FAD2CF]',
      badgeText: 'text-[#C5221F]',
      accentDot: 'bg-[#EA4335]',
    },
  },
];

export const ExploreAgenda: FC = () => {
  return (
    <section
      id="agenda"
      className="w-full bg-[#FAF9F5] py-[80px] sm:py-[96px] lg:py-[112px] border-t border-[#E2DFD8] scroll-mt-[48px]"
    >
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-2xl bg-white border border-[#E2DFD8] text-xs font-semibold text-[#1E1E1E] mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FBBC04]" />
              <span>Full-Day Schedule Announced</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black font-grotesk tracking-tight leading-tight">
              The Event Agenda
            </h2>
            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-[#4B5563] leading-relaxed font-sans">
              4 concurrent halls, 25+ speakers, hands-on workshops, and a live
              vibe lounge — all packed into one unforgettable day.
            </p>
          </motion.div>

          {/* View Full Agenda Button */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="shrink-0"
          >
            <Link
              href="/agenda"
              className="group relative inline-flex p-[2px] rounded-[100px] overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC04] rounded-[100px] transition-opacity group-hover:opacity-90" />
              <span className="relative px-6 sm:px-8 py-3 rounded-[100px] bg-[#18181b] group-hover:bg-[#232326] text-white text-sm sm:text-base font-semibold tracking-wide transition-colors flex items-center justify-center gap-2">
                <span>View Full Agenda</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* 4 Tracks Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {agendaHighlights.map((track, index) => (
            <motion.div
              key={track.tag}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={`border-2 ${track.colorScheme.border} rounded-[16px] bg-white p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow`}
            >
              <div>
                {/* Track Badge & Room */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`font-mono font-bold text-[10px] sm:text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-md ${track.colorScheme.badgeBg} ${track.colorScheme.badgeText}`}
                  >
                    {track.tag}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#555] bg-gray-100 px-2 py-0.5 rounded">
                    <MapPin className="w-3 h-3 text-[#777]" />
                    {track.room}
                  </span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#666] mb-3">
                  <Clock className="w-3.5 h-3.5 text-[#888]" />
                  <span>{track.time}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#1E1E1E] font-grotesk leading-snug mb-2">
                  {track.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed font-sans mb-4">
                  {track.description}
                </p>

                {/* Session Highlights List */}
                <div className="space-y-2 border-t border-[#F0EFEA] pt-4">
                  <span className="text-[11px] font-bold text-[#999] uppercase tracking-wider block">
                    Highlights
                  </span>
                  {track.sessions.map((session, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-start gap-2 text-xs text-[#222]"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${track.colorScheme.accentDot}`}
                      />
                      <span className="line-clamp-2 leading-tight font-medium">
                        {session}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Link */}
              <div className="mt-6 pt-4 border-t border-[#F0EFEA]">
                <Link
                  href="/agenda"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E1E1E] hover:text-[#4285F4] transition-colors"
                >
                  <span>See track schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-10 sm:mt-12 bg-white border-2 border-[#1E1E1E] rounded-[16px] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[4px_4px_0px_#1E1E1E]"
        >
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F8D8D8] border border-[#1E1E1E] flex items-center justify-center shrink-0">
              <Calendar className="w-[24px] h-[24px] text-[#1E1E1E] shrink-0" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-[#1E1E1E]">
                Saturday, November 29th, 2026 • 8:30 AM to 5:30 PM
              </h4>
              <p className="text-xs sm:text-sm text-[#555] mt-0.5">
                Kakanfo Inn &amp; Conference Centre, Ibadan. Don&apos;t miss a
                single moment.
              </p>
            </div>
          </div>

          <Link
            href="/agenda"
            className="w-full md:w-auto text-center px-6 py-3 rounded-2xl bg-[#1E1E1E] hover:bg-black text-white text-sm font-semibold tracking-wide transition-colors whitespace-nowrap"
          >
            Explore Complete Schedule →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ExploreAgenda;
