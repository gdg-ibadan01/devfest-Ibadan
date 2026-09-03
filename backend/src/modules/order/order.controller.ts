import {
  Body,
  Controller,
  Get,
  HttpException,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import { OrdersService } from './order.service';
import {
  AdminCreateOrderDto,
  CreateOrderDto,
  CreateOrderResponseDto,
  GetOrderReferenceResponseDto,
  OrderListResponseDto,
  OrdersQueryDto,
} from './create-order.dto';
import { PermissionsGuard } from '../admin/guards/permissions.guard';
import { RequirePermission } from 'src/common/decorators/permissions.decorator';
import { ServiceError } from '../../common/errors/service-error';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { IJwtPayload } from '../admin/interfaces/admin.interface';

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

  @Get()
  @ApiBearerAuth()
  @RequirePermission('orders.list')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({
    summary: 'List orders',
    description:
      'Cursor-paginated list of orders. By default returns earlier-dated orders first.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search orders by attendee email, attendee full name, or reference (case-insensitive)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: [
      'AWAITING_PAYMENT',
      'PAID',
      'CANCELLED',
      'AWAITING_REFUND',
      'REFUNDED',
    ],
    description:
      'Filter by order status. When omitted, orders of all statuses are returned.',
  })
  @ApiQuery({
    name: 'direction',
    required: false,
    enum: ['next', 'previous'],
    description:
      'Pagination direction. `next` returns earlier-dated orders, `previous` returns more recent orders.',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description:
      'Cursor for pagination. Pass the ID of the last item from the previous page.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of results per page (default 20, max 50)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orders retrieved successfully',
    type: OrderListResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Requires permission',
  })
  findAll(@Query() query: OrdersQueryDto) {
    return this.ordersService.list(query);
  }

  @Get('reference/:reference')
  @ApiOperation({
    summary: 'Get order by payment reference',
  })
  @ApiParam({
    name: 'reference',
    example: 'EarlyBird-ABC123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order found',
    type: GetOrderReferenceResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order not found for reference',
  })
  async findByReference(@Param('reference') reference: string) {
    try {
      return await this.ordersService.findByReference(reference);
    } catch (err) {
      if (err instanceof HttpException) throw err;

      switch ((err as Error).name) {
        case OrdersService.ERRORS.OrderNotFoundErr:
          throw new HttpException((err as Error).message, HttpStatus.NOT_FOUND);
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

          case OrdersService.ERRORS.TicketNotFoundErr:
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
