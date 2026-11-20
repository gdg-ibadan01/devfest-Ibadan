'use client';

import { useCallback } from 'react';
import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import AttendeesTable from './_components/AttendeesTable';
import { useCheckInAttendee } from '@/app/_module/services';
import type { OrderListItemDto } from '@/app/_module/api/types';

export default function AttendeesPageClient() {
  // Success / "already checked in" / error toasts are raised by the hook.
  const {
    mutate: checkIn,
    isPending: checkInPending,
    variables: checkInVariables,
  } = useCheckInAttendee();

  // Track which specific row is mid check-in so only that row's action
  // shows a loading state (the mutation itself has no per-row concept).
  const checkingInOrderId = checkInPending
    ? checkInVariables?.orderId
    : undefined;

  const handleCheckIn = useCallback(
    (order: OrderListItemDto) => checkIn({ orderId: order.id }),
    [checkIn]
  );

  return (
    <AdminWrapper title="Attendees">
      <div className="lg:px-[32px] px-[20px] py-[24px]">
        <AttendeesTable
          onCheckIn={handleCheckIn}
          checkingInOrderId={checkingInOrderId}
        />
      </div>
    </AdminWrapper>
  );
}
