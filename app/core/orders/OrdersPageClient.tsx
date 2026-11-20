'use client';

import { useState } from 'react';
import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import OrdersTable from './_components/OrdersTable';
import CreateOrderModal from './_components/CreateOrderModal';
import OrderDetailsModal from './_components/OrderDetailsModal';
import ReconciliationModal from './_components/ReconciliationModal';
import ResolvePaymentModal from './_components/ResolvePaymentModal';
import type { OrderListItemDto } from '@/app/_module/api/types';

export default function OrdersPageClient() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReconciliation, setShowReconciliation] = useState(false);
  const [resolveOrder, setResolveOrder] = useState<OrderListItemDto | null>(
    null
  );
  const [selectedOrder, setSelectedOrder] = useState<OrderListItemDto | null>(
    null
  );

  return (
    <AdminWrapper title="Orders">
      <div className="lg:px-[32px] px-[20px] py-[24px]">
        <OrdersTable
          onCreateNew={() => setShowCreateModal(true)}
          onViewDetails={(order) => setSelectedOrder(order)}
          onPaymentIssues={() => setShowReconciliation(true)}
          onResolvePayment={(order) => setResolveOrder(order)}
        />
      </div>

      <CreateOrderModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <ResolvePaymentModal
        order={resolveOrder}
        onClose={() => setResolveOrder(null)}
      />

      <ReconciliationModal
        open={showReconciliation}
        onClose={() => setShowReconciliation(false)}
      />

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </AdminWrapper>
  );
}
