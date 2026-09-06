'use client';

import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useClickOutside from '@/hooks/useClickOutside';

export interface Tab {
  id: string;
  label: string;
}

const DEFAULT_TABS: Tab[] = [
  { id: 'pre-dev-fest', label: 'Pre Dev Fest' },
  { id: 'friday-25', label: 'Friday, 25th Oct 2026' },
  { id: 'saturday-26', label: 'Saturday, 26th Oct 2026' },
];

interface AgendaTabMenuProps {
  tabs?: Tab[];
  activeTab?: string;
  onChange?: (tabId: string) => void;
}

export default function AgendaTabMenu({
  tabs = DEFAULT_TABS,
  activeTab,
  onChange,
}: AgendaTabMenuProps) {
  const [localActiveTab, setLocalActiveTab] = useState(tabs[0]?.id || '');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentTabId = activeTab !== undefined ? activeTab : localActiveTab;
  const currentTab = tabs.find((t) => t.id === currentTabId) || tabs[0];

  const handleTabChange = (tabId: string) => {
    if (onChange) {
      onChange(tabId);
    }
    setLocalActiveTab(tabId);
    setIsOpen(false);
  };

  // Close dropdown on click outside
  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className="w-full bg-[#6A936F] font-sans">
      {/* Mobile view */}
      <div className="md:hidden pt-4 px-4 relative" ref={dropdownRef}>
        <div className="mx-auto w-full max-w-[350px] relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex justify-between items-center bg-[#E2F1E3] text-[#1E3F20] px-5 py-3 rounded-t-[8px] font-bold text-[16px] w-full shadow-sm hover:bg-[#d6eada] transition-colors focus:outline-none"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <span>{currentTab?.label}</span>
            <ChevronDown
              className={`w-5 h-5 text-[#1E3F20] transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 mt-2 w-full bg-white border border-[#D1E2D3] rounded-[12px] shadow-xl z-50 overflow-hidden py-1"
                role="listbox"
              >
                {tabs.map((tab) => {
                  const isSelected = tab.id === currentTabId;
                  return (
                    <li
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`px-5 py-3 text-left transition-colors font-semibold text-[15px] cursor-pointer ${
                        isSelected
                          ? 'bg-[#E2F1E3] text-[#1E3F20]'
                          : 'text-gray-700 hover:bg-[#F3F8F4] hover:text-[#1E3F20]'
                      }`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      {tab.label}
                    </li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:flex justify-center items-end gap-16 px-6 h-[76px]">
        {tabs.map((tab) => {
          const isSelected = tab.id === currentTabId;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`relative px-8 pt-4 pb-3 flex items-center justify-center h-[56px] text-[16px] font-bold focus:outline-none select-none transition-colors duration-200 cursor-pointer ${
                isSelected
                  ? 'text-[#1E3F20]'
                  : 'text-white hover:text-[#E2F1E3]'
              }`}
            >
              <span className="relative z-10">{tab.label}</span>
              {isSelected && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-[#E2F1E3] rounded-t-[12px]"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
