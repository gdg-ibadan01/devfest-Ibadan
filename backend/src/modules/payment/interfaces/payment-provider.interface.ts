import { ServiceError } from 'src/common/errors/service-error';
import type { PaymentProviderName } from 'src/config/payment.config';

export type { PaymentProviderName } from 'src/config/payment.config';

export interface InitializePaymentParams {
  amount: number;
  customerName: string;
  customerEmail: string;
  paymentReference: string;
  description?: string;
  redirectUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface InitializedPayment {
  provider: string;
  transactionRef: string;
  checkoutUrl: string;
  vatAndCharges: number;
}

export interface RefundPaymentParams {
  transactionReference: string;
  refundReference: string;
  amount: number;
  reason: string;
}

export interface RefundPaymentResult {
  success: boolean;
  /** True when the gateway has no refund API and a human must refund the payer. */
  manual?: boolean;
  message?: string;
}

/** Everything needed to open a provider's inline checkout for one order. */
export interface CheckoutParams {
  orderId: string;
  reference: string;
  /** Naira (major units). */
  amount: number;
  customer: { fullName: string; email: string; phoneNumber?: string | null };
  description: string;
}

/**
 * Server-authored inline checkout. The browser passes `config` to the
 * provider's popup unchanged, so it never decides the amount or metadata.
 */
export interface CheckoutSession {
  provider: PaymentProviderName;
  mode: 'INLINE';
  reference: string;
  amount: number;
  currency: 'NGN';
  config: Record<string, unknown>;
}

export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED';

/** A provider transaction, as re-queried from the provider (the source of truth). */
export interface NormalizedTransaction {
  provider: PaymentProviderName;
  transactionRef: string;
  status: TransactionStatus;
  /** Gross amount the customer paid, in Naira. */
  amount: number;
  currency: string;
  orderId: string | null;
  /** Our order.reference, when the provider echoes it back. */
  reference: string | null;
  orderToken: string | null;
  paidAt: string | null;
  description: string | null;
  raw: unknown;
}

export interface PaymentProvider {
  readonly name: PaymentProviderName;
  /** How long a new order reserves its seat while awaiting payment. */
  readonly orderTtlMinutes: number;
  isConfigured(): boolean;
  createCheckout(params: CheckoutParams): Promise<CheckoutSession>;
  /** Hosted checkout page (used for admin-created orders). Optional. */
  initializePayment?(
    params: InitializePaymentParams,
  ): Promise<InitializedPayment>;
  getTransaction(transactionRef: string): Promise<NormalizedTransaction>;
  requestRefund(params: RefundPaymentParams): Promise<RefundPaymentResult>;
}

/**
 * A failed call to a payment gateway. `retryable` separates transient faults
 * (timeouts, 5xx: ask the caller to retry) from permanent ones (4xx).
 */
export class GatewayRequestError extends ServiceError {
  constructor(
    message: string,
    public readonly retryable: boolean,
    public readonly httpStatus?: number,
  ) {
    super(message, 'GatewayRequestErr');
  }
}
