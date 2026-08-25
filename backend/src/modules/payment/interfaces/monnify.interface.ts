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
