import { PaymentStatus } from '@prisma/client';

export interface IPayment {
  id: string;
  eventId: string;
  attendeeId: string;
  registrationId: string;
  amount: number;
  currency: string;
  paystackReference: string;
  paymentReference: string;
  status: PaymentStatus;
  paymentMethod?: string | null;
  paidAt: Date | null;
  failureReason?: string | null;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaystackResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface IPaystackWebhook {
  event: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: any;
    log: any;
    fees: number;
    fees_split: any;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name?: string;
    };
    customer: {
      id: number;
      first_name?: string;
      last_name?: string;
      email: string;
      customer_code: string;
      phone?: string;
      metadata?: any;
      risk_action: string;
    };
    plan: any;
    split: any;
    order_id?: any;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data?: any;
    source?: any;
  };
}
