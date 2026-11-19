import {
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  RawBodyRequest,
  Req,
  Headers,
  UnauthorizedException,
  ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';
import { ResendWebhookService } from './resend-webhook.service';
import { AlatpayService } from '../payment/alatpay.service';
import { PaymentConfirmationService } from '../checkout/payment-confirmation.service';
import { GatewayRequestError } from '../payment/interfaces/payment-provider.interface';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly webhookService: WebhookService,
    private readonly resendWebhook: ResendWebhookService,
    private readonly alatpay: AlatpayService,
    private readonly confirmation: PaymentConfirmationService,
  ) {}

  /**
   * ALATPay callback. Register this URL on the ALATPay merchant portal:
   *   POST <API_URL>/api/v1/webhooks/alatpay
   * 401 = bad signature; 503/500 = transient failure (safe to retry);
   * 200 = handled (including duplicates and non-completed statuses).
   */
  @Post('alatpay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Receive ALATPay transaction callbacks' })
  async handleAlatpayWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-signature') signature: string | undefined,
  ) {
    // Optional IP allowlist (ALATPAY_WEBHOOK_IP_ALLOWLIST). Behind a proxy
    // (e.g. Render) the caller is the last X-Forwarded-For hop, which the
    // proxy itself appends; otherwise it's the socket address.
    const forwarded = req.headers['x-forwarded-for'];
    const hops = (
      Array.isArray(forwarded) ? forwarded.join(',') : (forwarded ?? '')
    )
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);
    const callerIp = hops[hops.length - 1] ?? req.socket?.remoteAddress;
    if (!this.alatpay.isAllowedWebhookIp(callerIp)) {
      this.logger.warn(
        `Rejected ALATPay webhook from non-allowlisted IP ${callerIp}`,
      );
      throw new UnauthorizedException('Forbidden source');
    }

    if (!this.alatpay.verifyWebhookSignature(req.rawBody, signature)) {
      this.logger.warn(
        `Rejected ALATPay webhook: ${signature ? 'invalid' : 'missing'} x-signature`,
      );
      throw new UnauthorizedException('Invalid signature');
    }

    try {
      const result = await this.confirmation.handleAlatpayCallback(req.body);
      return { status: 'success', outcome: result.outcome };
    } catch (err) {
      const message = (err as Error).message;
      if (err instanceof GatewayRequestError && err.retryable) {
        this.logger.warn(`ALATPay webhook deferred (retryable): ${message}`);
        throw new ServiceUnavailableException('Temporary failure; retry');
      }
      this.logger.error(`ALATPay webhook handler error: ${message}`);
      throw new InternalServerErrorException('Could not process callback');
    }
  }

  @Post('monnify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Receive Monnify webhook events' })
  async handleMonnifyWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('monnify-signature') signature: string | undefined,
  ) {
    try {
      await this.webhookService.handleMonnifyEvent(
        req.body as Record<string, unknown>,
        signature,
        req.rawBody,
      );
    } catch (err) {
      this.logger.error(
        `Monnify webhook handler error: ${(err as Error).message}`,
      );
    }
    return { status: 'success' };
  }

  @Post('resend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Receive Resend delivery events (delivered, bounced, complained)',
  })
  async handleResendWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('svix-id') id: string | undefined,
    @Headers('svix-timestamp') timestamp: string | undefined,
    @Headers('svix-signature') signature: string | undefined,
  ) {
    const result = await this.resendWebhook.handle(req.rawBody, {
      id,
      timestamp,
      signature,
    });
    if (result.status === 'unauthorized') {
      throw new UnauthorizedException('Invalid signature');
    }
    return { status: result.status };
  }
}
