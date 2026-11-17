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
} from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';
import { ResendWebhookService } from './resend-webhook.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly webhookService: WebhookService,
    private readonly resendWebhook: ResendWebhookService,
  ) {}

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
