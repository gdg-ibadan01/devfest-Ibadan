'use client';

import React, { ReactNode } from 'react';

const AuthBg = ({ children }: { children: ReactNode }) => {
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
