import {
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  Headers,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';

@ApiTags('Webhook')
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly webhookService: WebhookService) {}

  @Post('monnify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Monnify events' })
  async handleMonnifyEvents(
    @Req() req: Request,
    @Headers('monnify-signature') signature: string | undefined,
  ) {
    try {
      await this.webhookService.handleMonnifyEvent(
        req.body as Record<string, unknown>,
        signature,
      );
    } catch (err) {
      this.logger.error(
        `Monnify webhook handler error: ${(err as Error).message}`,
      );
    }
    return { status: 'success' };
  }
}
