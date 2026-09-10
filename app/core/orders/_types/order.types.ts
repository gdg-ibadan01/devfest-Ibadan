// Order statuses as returned by the Orders API (`OrderListItemDto['status']`).
export type OrderStatus =
  | 'AWAITING_PAYMENT'
  | 'PAID'
  | 'CANCELLED'
  | 'AWAITING_REFUND'
  | 'REFUNDED';

export interface CreateOrderForm {
  fullName: string;
  email: string;
  phoneNumber: string;
  ticketSlug: string;
}
