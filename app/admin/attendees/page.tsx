'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import AttendeesTable from './_components/AttendeesTable';
import AddAttendeeModal from './_components/AddAttendeeModal';
import type { AttendeeRecord } from './_types/attendee.types';

/* ------------------------------------------------------------------ */
/* Check-in Toast                                                       */
/* ------------------------------------------------------------------ */
interface CheckInToastProps {
  attendee: AttendeeRecord | null;
  onClose: () => void;
}

function CheckInToast({ attendee, onClose }: CheckInToastProps) {
  useEffect(() => {
    if (!attendee) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [attendee, onClose]);

  if (!attendee) return null;

  return (
    <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-top-2 fade-in duration-300">
      <div className="flex items-start gap-3 bg-white rounded-xl shadow-xl border border-gray-100 px-5 py-4 w-[280px]">
        <div className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center flex-shrink-0 mt-0.5">
          <CheckCircle2 size={18} className="text-[#34A853]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-gray-900">Check In</p>
          <p className="text-[12px] text-gray-500 mt-0.5">Checked In Successfully</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 mt-0.5"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function AttendeesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [checkedInAttendee, setCheckedInAttendee] = useState<AttendeeRecord | null>(null);

  const handleCheckIn = useCallback((attendee: AttendeeRecord) => {
    setCheckedInAttendee(attendee);
  }, []);

  const handleToastClose = useCallback(() => {
    setCheckedInAttendee(null);
  }, []);

  return (
    <AdminWrapper title="Attendees">
      <div className="p-6">
        <AttendeesTable
          onAddNew={() => setShowAddModal(true)}
          onCheckIn={handleCheckIn}
        />
      </div>

      <AddAttendeeModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <CheckInToast
        attendee={checkedInAttendee}
        onClose={handleToastClose}
      />
    </AdminWrapper>
  );
}
