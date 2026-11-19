import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  dinero,
  add,
  greaterThan,
  NGN,
  subtract,
  Dinero,
  toSnapshot,
} from 'dinero.js';

import axios, { AxiosError } from 'axios';
import * as crypto from 'node:crypto';
import { ServiceError } from 'src/common/errors/service-error';
import {
  CheckoutParams,
  CheckoutSession,
  GatewayRequestError,
  InitializePaymentParams,
  InitializedPayment,
  NormalizedTransaction,
  PaymentProvider,
  RefundPaymentParams,
  RefundPaymentResult,
  TransactionStatus,
} from './interfaces/payment-provider.interface';
import {
  MonnifyEnvelope,
  MonnifyInitResponseBody,
  MonnifyLoginResponseBody,
  MonnifyRefundResponseBody,
  MonnifyTransactionStatusBody,
} from './interfaces/monnify.interface';
import monnifyConfig from 'src/config/monnify.config';

const REQUEST_TIMEOUT_MS = 10_000;
const TOKEN_SAFETY_MARGIN_SEC = 60;

@Injectable()
export class MonnifyService implements PaymentProvider {
  readonly name = 'MONNIFY' as const;

  static ERRORS = {
    AuthErr: 'MonnifyAuthErr',
    RequestErr: 'MonnifyRequestErr',
    InsufficientRefundAmountErr: 'InsufficientRefundAmountErr',
    ConfigErr: 'MonnifyConfigErr',
  } satisfies Record<string, `${string}Err`>;
  static REFUND_PROCESSING_FEE = 10;
  static MONNIFY_MINIMUM_REFUND = 100;

  private readonly logger = new Logger(MonnifyService.name);
  private accessToken: string | null = null;
  private tokenExpiresAtMs = 0;

  constructor(
    @Inject(monnifyConfig.KEY)
    private readonly mnfyCfg: ConfigType<typeof monnifyConfig>,
  ) {}

  get orderTtlMinutes(): number {
    return this.mnfyCfg.orderTtlMinutes;
  }

  isConfigured(): boolean {
    return Boolean(
      this.mnfyCfg.apiKey &&
      this.mnfyCfg.secretKey &&
      this.mnfyCfg.contractCode,
    );
  }

  /**
   * Config for the Monnify inline SDK (monnify-ts) on the frontend. The API key
   * and contract code are client-side credentials by design.
   */
  createCheckout(params: CheckoutParams): Promise<CheckoutSession> {
    const session: CheckoutSession = {
      provider: this.name,
      mode: 'INLINE',
      reference: params.reference,
      amount: params.amount,
      currency: 'NGN',
      config: {
        apiKey: this.getRequiredConfig('apiKey'),
        contractCode: this.getRequiredConfig('contractCode'),
        amount: params.amount,
        currency: 'NGN',
        reference: params.reference,
        customerFullName: params.customer.fullName,
        customerEmail: params.customer.email,
        paymentDescription: params.description,
        metadata: { orderId: params.orderId },
      },
    };
    return Promise.resolve(session);
  }

  /** Monnify transaction status (v2), used to confirm client-side completions. */
  async getTransaction(
    transactionReference: string,
  ): Promise<NormalizedTransaction> {
    let res: MonnifyEnvelope<MonnifyTransactionStatusBody>;
    try {
      res = await this.request<MonnifyTransactionStatusBody>(
        'GET',
        `/api/v2/transactions/${encodeURIComponent(transactionReference)}`,
      );
    } catch (err) {
      if (err instanceof ServiceError) {
        throw new GatewayRequestError(err.message, true);
      }
      const status = (err as AxiosError).response?.status;
      throw new GatewayRequestError(
        `Monnify transaction lookup failed: ${(err as Error).message}`,
        status === undefined || status >= 500 || status === 429,
        status,
      );
    }

    const body = res.responseBody;
    if (!res.requestSuccessful || !body) {
      throw new GatewayRequestError(
        res.responseMessage || 'Monnify transaction not found',
        false,
        404,
      );
    }

    const paymentStatus = String(body.paymentStatus ?? '').toUpperCase();
    let status: TransactionStatus = 'PENDING';
    if (paymentStatus === 'PAID' || paymentStatus === 'OVERPAID') {
      status = 'COMPLETED';
    } else if (
      ['FAILED', 'EXPIRED', 'CANCELLED', 'REVERSED', 'ABANDONED'].includes(
        paymentStatus,
      )
    ) {
      status = 'FAILED';
    }

    const metaData = (body.metaData ?? {}) as Record<string, unknown>;
    const amountPaid = Number(body.amountPaid ?? 0);

    return {
      provider: this.name,
      transactionRef: body.transactionReference ?? transactionReference,
      status,
      amount: Number.isFinite(amountPaid) ? amountPaid : 0,
      currency: String(
        body.currencyCode ?? body.currency ?? 'NGN',
      ).toUpperCase(),
      orderId:
        metaData.orderId != null ? String(metaData.orderId as string) : null,
      reference: body.paymentReference ?? null,
      orderToken: null,
      paidAt: body.paidOn ?? body.completedOn ?? null,
      description: body.paymentDescription ?? null,
      raw: body,
    };
  }

  calculateAmountWithCharges(amountInKobo: number) {
    const MONNIFY_CAP_CHARGE = 200000; // ₦2,000 in kobo
    const VAT_RATE = 0.075; // 7.5%
    const FEE_RATE = 0.015; // 1.5%

    amountInKobo = Math.trunc(amountInKobo);
    const effectiveFeeRate = FEE_RATE * (1 + VAT_RATE);
    const effectiveCapKobo = Math.round(MONNIFY_CAP_CHARGE * (1 + VAT_RATE));
    const capThresholdKobo = Math.round(MONNIFY_CAP_CHARGE / FEE_RATE);

    const productPrice = dinero({ amount: amountInKobo, currency: NGN });
    const capThreshold = dinero({ amount: capThresholdKobo, currency: NGN });
    const effectiveCap = dinero({ amount: effectiveCapKobo, currency: NGN });

    let toPay: Dinero<number>;
    if (greaterThan(productPrice, capThreshold)) {
      toPay = add(productPrice, effectiveCap);
    } else {
      const grossKobo = Math.round(amountInKobo / (1 - effectiveFeeRate));
      toPay = dinero({ amount: grossKobo, currency: NGN });
    }

    const vatAndCharges = subtract(toPay, productPrice);

    return {
      amount: Number((toSnapshot(toPay).amount / 100).toFixed(2)),
      vatAndCharges: Number(
        (toSnapshot(vatAndCharges).amount / 100).toFixed(2),
      ),
    };
  }

  async initializePayment(
    params: InitializePaymentParams,
  ): Promise<InitializedPayment> {
    try {
      const { amount, vatAndCharges } = this.calculateAmountWithCharges(
        params.amount * 100,
      );

      const payload = {
        amount,
        customerName: params.customerName,
        customerEmail: params.customerEmail,
        paymentReference: params.paymentReference,
        paymentDescription: params.description ?? 'Ticket purchase',
        currencyCode: 'NGN',
        contractCode: this.getRequiredConfig('contractCode'),
        redirectUrl: params.redirectUrl ?? this.getConfig('redirectUrl'),
        paymentMethods: ['CARD', 'ACCOUNT_TRANSFER'],
        metaData: params.metadata ?? {},
      };

      const res = await this.request<MonnifyInitResponseBody>(
        'POST',
        '/api/v1/merchant/transactions/init-transaction',
        payload,
      );

      if (
        !res.requestSuccessful ||
        !res.responseBody?.checkoutUrl ||
        !res.responseBody?.transactionReference
      ) {
        this.logger.error(
          `Monnify rejected transaction ${params.paymentReference}: ${res.responseMessage}`,
        );
        throw new ServiceError(
          res.responseMessage || 'Payment initialization failed',
          MonnifyService.ERRORS.RequestErr,
        );
      }

      return {
        provider: this.name,
        transactionRef: res.responseBody.transactionReference,
        checkoutUrl: res.responseBody.checkoutUrl,
        vatAndCharges,
      };
    } catch (err) {
      if (err instanceof ServiceError) throw err;
      this.logger.error(
        `Monnify initialize payment failed for ${params.paymentReference}: ${(err as Error).message}`,
      );
      throw new ServiceError(
        'Payment gateway is unreachable',
        MonnifyService.ERRORS.RequestErr,
      );
    }
  }

  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    const secret = this.getRequiredConfig('secretKey');
    const computed = Buffer.from(
      crypto.createHmac('sha512', secret).update(rawBody).digest('hex'),
    );
    const received = Buffer.from(signature.trim().toLowerCase());
    return (
      computed.length === received.length &&
      crypto.timingSafeEqual(computed, received)
    );
  }

  async requestRefund(
    params: RefundPaymentParams,
  ): Promise<RefundPaymentResult> {
    const tooLowToRefund =
      params.amount < MonnifyService.MONNIFY_MINIMUM_REFUND;
    if (tooLowToRefund) {
      throw new ServiceError(
        `Refund amount ${params.amount} below Monnify minimum ${MonnifyService.MONNIFY_MINIMUM_REFUND}`,
        MonnifyService.ERRORS.InsufficientRefundAmountErr,
      );
    }

    const payload = {
      transactionReference: params.transactionReference,
      refundReference: params.refundReference,
      refundAmount: params.amount,
      refundReason: params.reason,
      customerNote: 'Refund for ticket',
    };

    try {
      const res = await this.request<MonnifyRefundResponseBody>(
        'POST',
        '/api/v1/refunds/initiate-refund',
        payload,
      );

      if (!res.requestSuccessful) {
        this.logger.error(
          `Monnify refund rejected for ${params.refundReference}: ${res.responseMessage}`,
        );
        return { success: false, message: res.responseMessage };
      }

      return { success: true, message: res.responseBody?.comment };
    } catch (err) {
      if (err instanceof ServiceError) throw err;
      this.logger.error(
        `Monnify refund failed for ${params.refundReference}: ${(err as Error).message}`,
      );
      throw new ServiceError(
        'Payment gateway is unreachable',
        MonnifyService.ERRORS.RequestErr,
      );
    }
  }

  private async request<T>(
    method: 'GET' | 'POST',
    url: string,
    data?: unknown,
  ): Promise<MonnifyEnvelope<T>> {
    const config = {
      method,
      url: `${this.baseUrl}${url}`,
      data,
      timeout: REQUEST_TIMEOUT_MS,
      headers: { Authorization: `Bearer ${await this.getAccessToken()}` },
    };

    try {
      const res = await axios.request<MonnifyEnvelope<T>>(config);
      return res.data;
    } catch (err) {
      if ((err as AxiosError).response?.status === 401) {
        this.invalidateToken();
        config.headers.Authorization = `Bearer ${await this.getAccessToken()}`;
        const retryRes = await axios.request<MonnifyEnvelope<T>>(config);
        return retryRes.data;
      }
      throw err;
    }
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAtMs) {
      return this.accessToken;
    }

    const apiKey = this.getRequiredConfig('apiKey');
    const secretKey = this.getRequiredConfig('secretKey');
    const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString(
      'base64',
    );

    try {
      const res = await axios.post<MonnifyEnvelope<MonnifyLoginResponseBody>>(
        `${this.baseUrl}/api/v1/auth/login`,
        null,
        {
          timeout: REQUEST_TIMEOUT_MS,
          headers: { Authorization: `Basic ${credentials}` },
        },
      );

      const body = res.data?.responseBody;
      if (!res.data?.requestSuccessful || !body?.accessToken) {
        throw new ServiceError(
          res.data?.responseMessage || 'Monnify authentication failed',
          MonnifyService.ERRORS.AuthErr,
        );
      }

      this.accessToken = body.accessToken;
      const expiresInSec =
        typeof body.expiresIn === 'number' ? body.expiresIn : 3600;
      this.tokenExpiresAtMs =
        Date.now() +
        Math.max(
          expiresInSec - TOKEN_SAFETY_MARGIN_SEC,
          TOKEN_SAFETY_MARGIN_SEC,
        ) *
          1000;
      return this.accessToken;
    } catch (err) {
      if (err instanceof ServiceError) throw err;
      this.logger.error(`Monnify login failed: ${(err as Error).message}`);
      throw new ServiceError(
        'Could not authenticate with payment gateway',
        MonnifyService.ERRORS.AuthErr,
      );
    }
  }

  private invalidateToken() {
    this.accessToken = null;
    this.tokenExpiresAtMs = 0;
  }

  private get baseUrl(): string {
    return this.getConfig('baseUrl').replace(/\/+$/, '');
  }

  private getConfig(key: keyof ConfigType<typeof monnifyConfig>): string {
    const value = this.mnfyCfg[key];
    return value != null ? String(value) : '';
  }

  private getRequiredConfig(
    key: keyof ConfigType<typeof monnifyConfig>,
  ): string {
    const value = this.getConfig(key);
    if (!value) {
      throw new ServiceError(
        `Monnify ${key} is not configured`,
        MonnifyService.ERRORS.ConfigErr,
      );
    }
    return value;
  }
}
