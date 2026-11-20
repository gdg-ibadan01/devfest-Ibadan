'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ScanLine, UserPlus } from 'lucide-react';
import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import CheckInStatsPanel from '@/app/_module/components/cards/CheckInStatsPanel';
import { useMyPermissions } from '@/app/_module/services';
import CheckinsTable from './_components/CheckinsTable';
import QuickCheckIn from './_components/QuickCheckIn';
import WalkInModal from './_components/WalkInModal';

export default function CheckinsPageClient() {
  const { can } = useMyPermissions();
  const canCheckIn = can('attendees.check_in');
  // Walk-ins create an order and then check it in.
  const canWalkIn = canCheckIn && can('attendees.create');
  const [walkInOpen, setWalkInOpen] = useState(false);

  return (
    <AdminWrapper title="Checkins">
      <div className="lg:px-[32px] px-[20px] py-[24px]">
        {canCheckIn && (
          <div className="mb-4 flex flex-wrap gap-3">
            <Link
              href="/core/checkins/scan"
              className="inline-flex items-center gap-2 rounded-md bg-[#4285F4] px-5 py-[11px] text-[13px] font-semibold text-white transition-colors hover:bg-[#3367D6]"
            >
              <ScanLine size={16} /> Scan tickets
            </Link>
            {canWalkIn && (
              <button
                type="button"
                onClick={() => setWalkInOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-[11px] text-[13px] font-semibold text-gray-800 transition-colors hover:bg-gray-50"
              >
                <UserPlus size={16} /> Walk-in registration
              </button>
            )}
          </div>
        )}
        {canCheckIn && <QuickCheckIn />}
        <CheckInStatsPanel className="mb-6 border border-gray-200" />
        <CheckinsTable />
      </div>

      {canWalkIn && (
        <WalkInModal open={walkInOpen} onClose={() => setWalkInOpen(false)} />
      )}
    </AdminWrapper>
  );
}
