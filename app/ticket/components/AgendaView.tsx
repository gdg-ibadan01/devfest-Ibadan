'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AgendaTabMenu from './AgendaTabMenu';
import AgendaTable, { AgendaRow } from './AgendaTable';
import {
  FRIDAY_TABLES,
  PRE_DEV_FEST_TABLES,
  SATURDAY_TABLES,
} from './agendaConstants';

interface TableData {
  title: string;
  rows: AgendaRow[];
}

const TABS_ORDER = ['pre-dev-fest', 'friday-25', 'saturday-26'];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -30 : 30,
    opacity: 0,
  }),
};

const AgendaView = () => {
  const [activeTab, setActiveTab] = useState('pre-dev-fest');
  const [direction, setDirection] = useState(1); // 1 = slide from right, -1 = slide from left

  const handleTabChange = (newTabId: string) => {
    const prevIndex = TABS_ORDER.indexOf(activeTab);
    const newIndex = TABS_ORDER.indexOf(newTabId);
    setDirection(newIndex > prevIndex ? 1 : -1);
    setActiveTab(newTabId);
  };

  const getTablesForTab = () => {
    switch (activeTab) {
      case 'pre-dev-fest':
        return PRE_DEV_FEST_TABLES;
      case 'friday-25':
        return FRIDAY_TABLES;
      case 'saturday-26':
        return SATURDAY_TABLES;
      default:
        return PRE_DEV_FEST_TABLES;
    }
  };

  const tables = getTablesForTab();

  return (
    <section className="pt-[32px] px-[23px] md:py-[74px] bg-[#F0F0F0]">
      <div className="w-full mx-auto md:max-w-[1240px]">
        <div className="mb-10">
          <AgendaTabMenu activeTab={activeTab} onChange={handleTabChange} />
        </div>
        <div></div>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-[54px]"
          >
            {tables.map((table, idx) => (
              <AgendaTable key={idx} title={table.title} rows={table.rows} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AgendaView;
