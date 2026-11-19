import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrdersService } from '../order/order.service';
import { PaymentConfirmationService } from './payment-confirmation.service';
import { AlatpayService } from '../payment/alatpay.service';
import { IpRateLimitGuard } from './ip-rate-limit.guard';
import {
  CheckoutSessionResponseDto,
  VerifyCheckoutDto,
  VerifyCheckoutResponseDto,
} from './dto/checkout.dto';
import { JwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import { PermissionsGuard } from '../admin/guards/permissions.guard';
import { RequirePermission } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { IJwtPayload } from '../admin/interfaces/admin.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { GatewayRequestError } from '../payment/interfaces/payment-provider.interface';

@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {
  private readonly logger = new Logger(CheckoutController.name);

  constructor(
    private readonly orders: OrdersService,
    private readonly confirmation: PaymentConfirmationService,
    private readonly prisma: PrismaService,
    private readonly alatpay: AlatpayService,
  ) {}

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @UseGuards(IpRateLimitGuard)
  @ApiOperation({
    summary: 'Confirm a payment the checkout popup reported as complete',
    description:
      'Re-queries the gateway the order was created on and, if the transaction is completed and belongs to this order, marks it PAID and issues tickets. Idempotent; the webhook does the same independently.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: VerifyCheckoutResponseDto })
  async verify(@Body() dto: VerifyCheckoutDto) {
    try {
      return await this.confirmation.verifyFromClient(
        dto.reference,
        dto.transactionRef,
      );
    } catch (err) {
      throw this.toHttp(err);
    }
  }

  @Post('requery')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('orders.list')
  @ApiOperation({
    summary: 'Admin: re-check a payment by gateway transaction id',
    description:
      'Use when a customer has paid but the order is still awaiting payment.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: VerifyCheckoutResponseDto })
  async requery(
    @Body() dto: VerifyCheckoutDto,
    @CurrentUser() user: IJwtPayload,
  ) {
    try {
      const result = await this.confirmation.verifyFromClient(
        dto.reference,
        dto.transactionRef,
        'ADMIN',
      );
      await this.prisma.auditLog
        .create({
          data: {
            adminId: user.sub,
            action: 'REQUERY_PAYMENT',
            metadata: {
              reference: dto.reference,
              transactionRef: dto.transactionRef,
              outcome: result.outcome,
              status: result.status,
            },
          },
        })
        .catch((e: Error) =>
          this.logger.error(`Failed to audit payment requery: ${e.message}`),
        );
      return result;
    } catch (err) {
      throw this.toHttp(err);
    }
  }

  @Get('admin/alatpay-transactions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('orders.list')
  @ApiOperation({
    summary: 'Admin: recent ALATPay transactions as the gateway reports them',
    description:
      'Support/diagnostics for "paid but not confirmed": lists transactions since `hours` ago (default 3, max 48) with the order they belong to.',
  })
  async alatpayTransactions(@Query('hours') hours?: string) {
    // hours=all → no date filter (latest transactions, newest first)
    const h = Math.min(Math.max(Number(hours) || 3, 1), 48);
    try {
      return await this.alatpay.inspectTransactions(
        hours === 'all' ? null : new Date(Date.now() - h * 3_600_000),
      );
    } catch (err) {
      if (err instanceof GatewayRequestError) {
        throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);
      }
      throw this.toHttp(err);
    }
  }

  @Get(':reference')
  @UseGuards(IpRateLimitGuard)
  @ApiOperation({
    summary: 'Get the inline checkout for an unpaid order',
    description:
      'Used by the pay-link page and "Complete payment". Returns payment=null once the order is no longer awaiting payment.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: CheckoutSessionResponseDto })
  async getCheckout(@Param('reference') reference: string) {
    try {
      return await this.orders.getCheckoutSession(reference);
    } catch (err) {
      throw this.toHttp(err);
    }
  }

  private toHttp(err: unknown): HttpException {
    if (err instanceof HttpException) return err;
    const error = err as Error;

    if (err instanceof GatewayRequestError) {
      this.logger.warn(`Gateway error: ${error.message}`);
      return new HttpException(
        'Could not confirm payment with the gateway yet. Please try again shortly.',
        HttpStatus.BAD_GATEWAY,
      );
    }

    switch (error.name) {
      case OrdersService.ERRORS.OrderNotFoundErr:
        return new HttpException(error.message, HttpStatus.NOT_FOUND);
      case OrdersService.ERRORS.OrderExpiredErr:
        return new HttpException(error.message, HttpStatus.GONE);
      case OrdersService.ERRORS.ValidationErr:
        return new HttpException(error.message, HttpStatus.BAD_REQUEST);
      case OrdersService.ERRORS.PaymentErr:
        return new HttpException(error.message, HttpStatus.BAD_GATEWAY);
      default:
        this.logger.error(`Checkout error: ${error.message}`, error.stack);
        return new HttpException(
          'Something went wrong. Please try again.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
