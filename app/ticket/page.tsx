'use client';
import { useState } from 'react';
import CheckOut from './components/CheckOut';
import Summary from './components/Summary';
import { AnimatePresence, motion } from 'framer-motion';
import useMediaQueryWatcher from '../_module/config/hooks/useMediaQueryWatcher';

export default function Ticket() {
  const isTablet = useMediaQueryWatcher('(min-width: 1024px)');
  const [view, setView] = useState('checkout');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    jobTitle: '',
  });

  const renderFn = () => {
    switch (view) {
      case 'checkout':
        return (
          <CheckOut
            formData={formData}
            setFormData={setFormData}
            setView={setView}
          />
        );
      case 'summary':
        return <Summary setView={setView} formData={formData} />;
      default:
        return (
          <CheckOut
            formData={formData}
            setFormData={setFormData}
            setView={setView}
          />
        );
    }
  };

  return (
    <>
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
            className="w-full md:w-[700px]"
            key={view}
            initial={{ x: '10%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-10%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderFn()}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
