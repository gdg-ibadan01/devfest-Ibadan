import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequirePermission } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ServiceError } from 'src/common/errors/service-error';
import { JwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import { PermissionsGuard } from '../admin/guards/permissions.guard';
import { IJwtPayload } from '../admin/interfaces/admin.interface';
import { PaymentProviderRegistry } from './payment-provider.registry';
import {
  PaymentGatewayStatusDto,
  SetPaymentGatewayDto,
} from './dto/payment-gateway.dto';

@ApiTags('payment-gateway')
@ApiBearerAuth()
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Not authenticated',
})
@ApiResponse({
  status: HttpStatus.FORBIDDEN,
  description: 'Requires permission',
})
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('payment-gateway')
export class PaymentGatewayController {
  constructor(private readonly registry: PaymentProviderRegistry) {}

  @Get()
  @RequirePermission('payment_gateway.view')
  @ApiOperation({
    summary:
      'Payment gateway for new orders, and which gateways are configured',
  })
  @ApiResponse({ status: HttpStatus.OK, type: PaymentGatewayStatusDto })
  getGateway(): Promise<PaymentGatewayStatusDto> {
    return this.registry.getStatus();
  }

  @Put()
  @RequirePermission('payment_gateway.manage')
  @ApiOperation({
    summary:
      'Switch the payment gateway for new orders (orders already started keep theirs)',
    description:
      'Takes effect immediately on this instance; other instances pick it up within 30 seconds. Recorded in the audit log as SWITCH_PAYMENT_GATEWAY.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Switched. Returns the new status.',
    type: PaymentGatewayStatusDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Unknown gateway, or its credentials are missing on the server',
  })
  async setGateway(
    @Body() dto: SetPaymentGatewayDto,
    @CurrentUser() user: IJwtPayload,
  ): Promise<PaymentGatewayStatusDto> {
    try {
      return await this.registry.setActive(dto.provider, user.sub);
    } catch (err) {
      if (err instanceof ServiceError) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }
}
