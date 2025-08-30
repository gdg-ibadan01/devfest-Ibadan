'use client';

import useMediaQueryWatcher from '@/app/_module/config/hooks/useMediaQueryWatcher';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export const AdminLogin = () => {
  const isTablet = useMediaQueryWatcher('(min-width: 1024px)');

  return (
    <div
      className="h-screen w-full flex items-center justify-center px-5"
      style={{
        backgroundImage: isTablet
          ? "url('/ticket_bg.png')"
          : "url('/ticket_mobile_bg.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          className="w-full md:w-[500px]"
          initial={{ x: '10%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-10%', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <h1 className="text-xl md:text-3xl font-bold text-center text-gray-600 mb-4">
            Admin Login
          </h1>

          <form className="bg-white px-4 md:px-28 py-28 rounded-2xl flex flex-col gap-5 border md:border-none">
            <div className="w-full  flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-gray-600 text-sm md:text-base"
              >
                Email Address
              </label>
              <input
                type="text"
                id="email"
                placeholder="Enter your email address"
                required
                value=""
                onChange={() => {}}
                className="w-full border border-gray-200 px-4 py-2 rounded-md outline-none text-gray-400 text-sm md:text-base"
              />
            </div>
            <div className="w-full flex flex-col gap-1">
              <label
                htmlFor="fullName"
                className="text-gray-600 text-sm md:text-base"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
                value=""
                onChange={() => {}}
                className="border border-gray-200 px-4 py-2 rounded-md outline-none text-gray-400 text-sm md:text-base"
              />
            </div>
            <button className="bg-[#1E1E1E] py-3 md:py-4 text-white hover:bg-core-blue rounded-[100px] flex gap-2 justify-center transition-colors duration-500 mt-6">
              Login <ArrowUpRight />
            </button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
