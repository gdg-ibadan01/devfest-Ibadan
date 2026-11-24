'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { THANK_YOU } from '@/app/_module/data/thank-you.data';

const KEY = 'thank-you-bar-dismissed';

export default function ThankYouBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(sessionStorage.getItem(KEY) !== '1');
    } catch {
      setVisible(true);
    }
  }, []);

  // Home already has the full thank-you page.
  if (!visible || pathname === '/') return null;

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      role="status"
      className="fixed inset-x-3 bottom-4 z-30 mx-auto flex max-w-[560px] items-center justify-between gap-3 rounded-[100px] border-2 border-[#1a1a1a] bg-[#E3CC8F] py-2 pl-5 pr-2 text-[14px] font-semibold text-[#1a1a1a] shadow-lg"
    >
      <span>{THANK_YOU.barText}</span>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[50%] bg-[#1a1a1a] text-white"
      >
        ×
      </button>
    </div>
  );
}
