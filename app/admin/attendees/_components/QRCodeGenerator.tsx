'use client';

import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeGenerator = () => {
  return (
    <div className="w-full py-[32px] bg-[#F7F7F7] border border-[#EBEBEB] rounded-lg">
      <div
        style={{
          height: 'auto',
          margin: '0 auto',
          maxWidth: 300,
          width: '100%',
        }}
      >
        <QRCode
          size={300}
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          value="https://devfestibadan.com"
          viewBox={`0 0 300 300`}
        />
      </div>
    </div>
  );
};

export default QRCodeGenerator;
