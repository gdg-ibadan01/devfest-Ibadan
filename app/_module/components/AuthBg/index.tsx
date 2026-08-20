'use client';

import React, { ReactNode, useEffect } from 'react';

const AuthBg = ({ children }: { children: ReactNode }) => {
  // Lock body scroll while any auth page is mounted
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div
      style={{
        backgroundImage: "url('/pastel-blue-art.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom',
        backgroundSize: 'cover',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
        position: 'fixed',
      }}
    >
      {children}
    </div>
  );
};

export default AuthBg;
