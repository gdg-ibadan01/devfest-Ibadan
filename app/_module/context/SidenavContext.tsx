'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SidenavContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const SidenavContext = createContext<SidenavContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export function SidenavProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SidenavContext.Provider
      value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}
    >
      {children}
    </SidenavContext.Provider>
  );
}

export function useSidenav() {
  return useContext(SidenavContext);
}
