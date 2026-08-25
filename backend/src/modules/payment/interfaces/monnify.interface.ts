export interface MonnifyLoginResponseBody {
  accessToken: string;
  expiresIn: number;
}

export interface MonnifyInitResponseBody {
  transactionReference: string;
  paymentReference: string;
  checkoutUrl: string;
  enabledPaymentMethod?: string[];
}

export interface MonnifyEnvelope<T> {
  requestSuccessful: boolean;
  responseMessage?: string;
  responseCode?: string;
  responseBody?: T;
}

export interface MonnifyWebhookEventData {
  product: { reference: string; type: string };
  transactionReference: string;
  paymentReference: string;
  paidOn: string;
  paymentDescription: string;
  metaData: Record<string, unknown>;
  amountPaid: number;
  totalPayable: number;
  settlementAmount: string;
  paymentMethod: string;
  currency: string;
  paymentStatus: string;
  customer: { name: string; email: string };
  cardDetails: Record<string, unknown> | null;
  accountDetails: Record<string, unknown> | null;
}

export interface MonnifyWebhookEvent {
  eventType: string;
  eventData: MonnifyWebhookEventData;
}
