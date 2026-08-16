'use client';

import IconsArt from '@/app/component/IconsArt';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  Calendar,
  Compass,
  Home,
  MapPin,
  Search,
  Sparkles,
  Ticket,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const quickLinks = [
    {
      title: 'Get Ticket & RSVP',
      description:
        'Secure your spot for DevFest Ibadan 2025 on Nov 28th & 29th',
      href: '/rsvp',
      icon: Ticket,
      bgColor: 'bg-[#F8D8D8]',
      accentColor: 'text-[#EA4335]',
      badge: 'Registration Open',
    },
    {
      title: 'Promised Agenda',
      description: 'Explore sessions, keynotes, and workshops schedule',
      href: '/agenda',
      icon: Calendar,
      bgColor: 'bg-[#CCF6C5]',
      accentColor: 'text-[#0F9D58]',
      badge: 'Nov 28 & 29',
    },
    {
      title: 'Event Speakers',
      description: 'Discover the tech leaders and experts presenting live',
      href: '/speakers',
      icon: Users,
      bgColor: 'bg-[#FFE7A5]',
      accentColor: 'text-[#FBBC04]',
      badge: 'Lineup',
    },
    {
      title: 'Our Sponsors',
      description:
        'Meet the organizations driving the tech ecosystem in Ibadan',
      href: '/sponsors',
      icon: Award,
      bgColor: 'bg-[#C3ECF6]',
      accentColor: 'text-[#4285F4]',
      badge: 'Partners',
    },
    {
      title: 'DevFest Mainstage',
      description: 'Return to the home page hero and event highlights',
      href: '/',
      icon: Home,
      bgColor: 'bg-[#F8F6E2]',
      accentColor: 'text-[#1E1E1E]',
      badge: 'Home',
    },
  ];

  const filteredLinks = quickLinks.filter(
    (link) =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen pt-[130px] md:pt-[160px] pb-12 bg-pastel-yellow/30 relative overflow-hidden flex flex-col justify-between">
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-core-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-80 h-80 bg-core-red/10 rounded-full blur-3xl pointer-events-none" />

      <main className="container max-w-[1200px] mx-auto px-4 relative z-10 flex-1 flex flex-col items-center">
        {/* GDG Tag Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#1E1E1E] rounded-full shadow-[4px_4px_0px_0px_rgba(30,30,30,1)] mb-6 text-sm font-bold text-[#1E1E1E]"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335] animate-ping" />
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#4285F4]" />
            DEVFEST IBADAN &apos;25 • PAGE NOT FOUND
          </span>
        </motion.div>

        {/* Hero 404 Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center gap-2 md:gap-6 my-4 select-none"
        >
          <span className="font-extrabold text-7xl md:text-9xl text-[#EA4335] tracking-tighter drop-shadow-md">
            4
          </span>

          {/* Animated Interactive Center Zero Element */}
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
              className="w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-dashed border-[#1E1E1E] bg-[#FFE7A5] flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(30,30,30,1)]"
            >
              <Compass className="w-10 h-10 md:w-16 md:h-16 text-[#4285F4]" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="w-4 h-4 rounded-full bg-[#0F9D58] animate-bounce" />
            </div>
          </div>

          <span className="font-extrabold text-7xl md:text-9xl text-[#0F9D58] tracking-tighter drop-shadow-md">
            4
          </span>
        </motion.div>

        {/* Heading & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <h1 className="font-bold text-3xl md:text-5xl text-[#1E1E1E] leading-tight">
            Oops! Page Not Found
          </h1>
          <p className="text-[#4D4D4D] text-base md:text-xl font-normal leading-relaxed">
            We couldn&apos;t find the page you&apos;re looking for. It might
            have been moved or isn&apos;t available yet, but we&apos;ll help you
            find your way back!
          </p>
        </motion.div>

        {/* Navigation Assistant Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-2xl bg-[#1E1E1E] text-white rounded-2xl p-5 md:p-6 border-2 border-black shadow-[8px_8px_0px_0px_rgba(30,30,30,1)] my-8 text-xs md:text-sm"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-700 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#EA4335]" />
              <span className="w-3 h-3 rounded-full bg-[#FBBC04]" />
              <span className="w-3 h-3 rounded-full bg-[#0F9D58]" />
            </div>
            <div className="flex items-center gap-2 text-gray-300 font-medium text-xs">
              <Compass className="w-3.5 h-3.5 text-[#57caff]" />
              <span>DevFest Navigation Assistant</span>
            </div>
          </div>

          {/* Card Messages */}
          <div className="space-y-2 text-gray-300">
            <p className="text-[#ff7daf]">
              • Status: Requested link unavailable (404)
            </p>
            <p className="text-gray-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#ffd427]" />
              <span>Location: DevFest Ibadan 2025 (Oyo State, Nigeria)</span>
            </p>
            <p className="text-[#57caff]">
              • Tip: Select a destination below or search for the page you need:
            </p>
          </div>

          {/* Live Filter Search Input */}
          <div className="mt-4 pt-3 border-t border-gray-700 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#ffd427] shrink-0" />
            <input
              type="text"
              placeholder="Search pages (e.g. ticket, agenda, speakers)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-xs md:text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-gray-400 hover:text-white px-2 py-0.5 rounded bg-gray-800"
              >
                Clear
              </button>
            )}
          </div>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mb-10 mt-2"
        >
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-black text-white hover:bg-core-blue hover:text-white rounded-[100px] px-8 py-6 text-base font-medium flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(30,30,30,1)] transition-all">
              <Home className="w-5 h-5" />
              Return to DevFest Home
              <ArrowUpRight className="w-5 h-5" />
            </Button>
          </Link>

          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full sm:w-auto bg-white text-[#1E1E1E] border-2 border-[#1E1E1E] hover:bg-[#FFE7A5] rounded-[100px] px-8 py-6 text-base font-medium flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(30,30,30,1)] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back Previous Page
          </Button>
        </motion.div>

        {/* Quick Links Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-full max-w-4xl space-y-4"
        >
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg md:text-xl font-bold text-[#1E1E1E]">
              Recommended Destinations
            </h2>
            <span className="text-xs text-[#4D4D4D] font-mono">
              {filteredLinks.length}{' '}
              {filteredLinks.length === 1 ? 'route' : 'routes'} available
            </span>
          </div>

          {filteredLinks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLinks.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <Link key={idx} href={item.href} className="group block">
                    <div
                      className={`${item.bgColor} border-2 border-[#1E1E1E] rounded-2xl p-5 h-full flex flex-col justify-between transition-all duration-200 group-hover:-translate-y-1.5 group-hover:shadow-[6px_6px_0px_0px_rgba(30,30,30,1)] shadow-[3px_3px_0px_0px_rgba(30,30,30,1)]`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="p-2.5 bg-white border-2 border-[#1E1E1E] rounded-xl">
                            <IconComponent
                              className={`w-5 h-5 ${item.accentColor}`}
                            />
                          </div>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 bg-white border border-[#1E1E1E] rounded-full text-[#1E1E1E]">
                            {item.badge}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-[#1E1E1E] group-hover:text-[#4285F4] transition-colors flex items-center gap-1">
                            {item.title}
                            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h3>
                          <p className="text-xs text-[#4D4D4D] mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs font-bold text-[#1E1E1E]">
                        <span>Explore Page</span>
                        <span className="group-hover:translate-x-1 transition-transform">
                          &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border-2 border-[#1E1E1E] rounded-2xl p-8 text-center space-y-2">
              <p className="text-base font-bold text-[#1E1E1E]">
                No routes matching &quot;{searchQuery}&quot;
              </p>
              <p className="text-xs text-[#4D4D4D]">
                Try searching for &quot;rsvp&quot;, &quot;agenda&quot;, or
                &quot;speakers&quot;.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs font-bold text-[#4285F4] underline"
              >
                Reset Search Filter
              </button>
            </div>
          )}
        </motion.div>
      </main>

      {/* GDG Ibadan Bottom Doodle Artwork */}
      <div className="relative w-full mt-12">
        <IconsArt showFull={false} />
      </div>
    </div>
  );
}
