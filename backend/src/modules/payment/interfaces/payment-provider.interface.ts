export const PAYMENT_PROVIDER = 'PAYMENT_PROVIDER';

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
}

export interface PaymentProvider {
  readonly name: string;
  initializePayment(
    params: InitializePaymentParams,
  ): Promise<InitializedPayment>;
}
