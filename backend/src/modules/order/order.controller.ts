import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './order.service';
import {
  CreateOrderDto,
  CreateOrderResponseDto,
  GetOrderReferenceResponseDto,
} from './create-order.dto';

@ApiTags('Order')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a ticket order',
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
  async create(@Body() payload: CreateOrderDto) {
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
        case OrdersService.ERRORS.TicketNotFoundErr:
          throw new HttpException((err as Error).message, HttpStatus.NOT_FOUND);
        default:
          throw new HttpException(
            (err as Error).message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
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
}
