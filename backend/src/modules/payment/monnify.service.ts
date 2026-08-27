import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import * as crypto from 'node:crypto';
import { ServiceError } from 'src/common/errors/service-error';
import {
  InitializePaymentParams,
  InitializedPayment,
  PaymentProvider,
  RefundPaymentParams,
  RefundPaymentResult,
} from './interfaces/payment-provider.interface';
import {
  MonnifyEnvelope,
  MonnifyInitResponseBody,
  MonnifyLoginResponseBody,
  MonnifyRefundResponseBody,
} from './interfaces/monnify.interface';
import monnifyConfig from 'src/config/monnify.config';

const REQUEST_TIMEOUT_MS = 30_000;
const TOKEN_SAFETY_MARGIN_SEC = 60;

@Injectable()
export class MonnifyService implements PaymentProvider {
  readonly name = 'MONNIFY';

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

  async initializePayment(
    params: InitializePaymentParams,
  ): Promise<InitializedPayment> {
    const payload = {
      amount: params.amount,
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

    try {
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
      };
    } catch (err) {
      if (err instanceof ServiceError) throw err;
      this.logger.error(
        `Monnify initialize failed for ${params.paymentReference}: ${(err as Error).message}`,
      );
      throw new ServiceError(
        'Payment gateway is unreachable',
        MonnifyService.ERRORS.RequestErr,
      );
    }
  }

  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    const secret = this.getRequiredConfig('secretKey');
    const computed = crypto
      .createHmac('sha512', secret)
      .update(rawBody)
      .digest('hex');
    return computed === signature;
  }

  async requestRefund(
    params: RefundPaymentParams,
  ): Promise<RefundPaymentResult> {
    const tooLowToRefund =
      params.amount - MonnifyService.MONNIFY_MINIMUM_REFUND <
      MonnifyService.MONNIFY_MINIMUM_REFUND;
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
