import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PaymentsService } from './payment.service';
import * as crypto from 'crypto';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { RolesGuard } from '../admin/guards/roles.guard';
import { JwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService,
  ) {}

  @Post('initialize')
  @ApiOperation({ summary: 'Initialize payment' })
  @ApiResponse({ status: 201, description: 'Payment initialized successfully' })
  async initiatePayment(@Body() initiatePaymentDto: InitiatePaymentDto) {
    return this.paymentsService.initiatePayment(initiatePaymentDto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify payment' })
  @ApiResponse({ status: 200, description: 'Payment verified successfully' })
  async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(verifyPaymentDto);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: Request,
    @Headers('x-paystack-signature') signature: string,
  ) {
    const secret = this.configService.get<string>('paystack.secretKey');
    const hash = crypto
      .createHmac('sha512', secret!)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== signature) {
      throw new ForbiddenException('Invalid Paystack webhook signature');
    }

    await this.paymentsService.handleWebhook(req.body);
    return { status: 'success' };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.paymentsService.findAll(page, limit);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }
}
