'use client';

import { useState } from 'react';
import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import OrdersTable from './_components/OrdersTable';
import CreateOrderModal from './_components/CreateOrderModal';
import OrderDetailsModal from './_components/OrderDetailsModal';
import type { OrderListItemDto } from '@/app/_module/api/types';

export default function OrdersPageClient() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderListItemDto | null>(
    null
  );

  return (
    <AdminWrapper title="Orders">
      <div className="lg:px-[32px] px-[20px] py-[24px]">
        <OrdersTable
          onCreateNew={() => setShowCreateModal(true)}
          onViewDetails={(order) => setSelectedOrder(order)}
        />
      </div>

      <CreateOrderModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </AdminWrapper>
  );
}
