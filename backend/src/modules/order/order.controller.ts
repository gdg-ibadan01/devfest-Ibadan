import {
  Body,
  Controller,
  HttpException,
  UseGuards,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { JwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrdersService } from './order.service';
import { RequirePermission } from 'src/common/decorators/permissions.decorator';
import { ServiceError } from '../../common/errors/service-error';
import { PermissionsGuard } from '../admin/guards/permissions.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { IJwtPayload } from '../admin/interfaces/admin.interface';
import {
  AdminCreateOrderDto,
  CreateOrderDto,
  CreateOrderResponseDto,
} from './create-order.dto';

@ApiTags('Order')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a ticket order(public self-service checkout)',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Order created and payment initialized',
    type: CreateOrderResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ticket not on sale or invalid request',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ticket not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Ticket sold out, all remaining units reserved, or duplicate order for attendee',
  })
  @ApiResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'Payment initialization failed',
  })
  async create(
    @Body() payload: CreateOrderDto,
  ): Promise<CreateOrderResponseDto> {
    try {
      return await this.ordersService.create(payload);
    } catch (err) {
      if (err instanceof HttpException) throw err;

      switch ((err as Error).name) {
        case OrdersService.ERRORS.ValidationErr:
        case OrdersService.ERRORS.NotOnSaleErr:
          throw new HttpException(
            (err as Error).message,
            HttpStatus.BAD_REQUEST,
          );
        case OrdersService.ERRORS.SoldOutErr:
        case OrdersService.ERRORS.RetryLaterErr:
        case OrdersService.ERRORS.DuplicateErr:
          throw new HttpException((err as Error).message, HttpStatus.CONFLICT);
        case OrdersService.ERRORS.PaymentErr:
          throw new HttpException(
            (err as Error).message,
            HttpStatus.BAD_GATEWAY,
          );
        default:
          throw new HttpException(
            (err as Error).message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }

  @Post('attendees')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('attendees.create')
  @ApiOperation({ summary: 'Admin creates an order on behalf of an attendee' })
  @ApiOkResponse({
    description: 'Order successfully created for the attendee',
    type: CreateOrderResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ticket not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Ticket sold out, all remaining units reserved, or duplicate order for attendee',
  })
  @ApiResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'Payment initialization failed',
  })
  @HttpCode(HttpStatus.CREATED)
  async createForAttendee(
    @Body() payload: AdminCreateOrderDto,
    @CurrentUser() user: IJwtPayload,
  ): Promise<CreateOrderResponseDto> {
    try {
      return await this.ordersService.create(payload, {
        createdById: user.sub,
        skipSaleWindowCheck: payload.skipSaleWindowCheck ?? false,
      });
    } catch (err) {
      if (err instanceof HttpException) throw err;

      if (err instanceof ServiceError) {
        switch (err.name) {
          case OrdersService.ERRORS.ValidationErr:
          case OrdersService.ERRORS.NotOnSaleErr:
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);

          case OrdersService.ERRORS.NotFoundErr:
            throw new HttpException(err.message, HttpStatus.NOT_FOUND);

          case OrdersService.ERRORS.SoldOutErr:
          case OrdersService.ERRORS.RetryLaterErr:
          case OrdersService.ERRORS.DuplicateErr:
            throw new HttpException(err.message, HttpStatus.CONFLICT);

          case OrdersService.ERRORS.PaymentErr:
            throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);

          default:
            throw new HttpException(
              err.message,
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
      }

      if ((err as { status?: number }).status) throw err;
      throw new HttpException(
        'Unable to process order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
