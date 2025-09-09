import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import SuccessToastIcon from '@/app/_module/components/icons/SuccessToastIcon';

interface SuccessModalProps {
  message: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SuccessModal = ({ message, open, onOpenChange }: SuccessModalProps) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="fixed top-4 right-4 left-auto translate-x-0 translate-y-0 w-auto max-w-sm p-0 border-0 shadow-lg rounded-lg bg-transparent"
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          transform: 'none',
          margin: 0,
        }}
      >
        {/* Toast container */}
        <div className="bg-[#D0FDEE] border-2 border-[#ffffff] rounded-[12px] p-[20px] flex items-center gap-3 min-w-[280px] shadow-sm">
          {/* Green checkmark circle */}
          <div className="flex-shrink-0 w-10 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <SuccessToastIcon />
          </div>
          {/* Message */}
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800 leading-tight">
              {message}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
