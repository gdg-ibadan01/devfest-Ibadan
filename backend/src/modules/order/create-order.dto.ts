import {
  IsEmail,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class OrderAttendeeDto {
  @ApiProperty({ example: 'Ada Obi' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @Transform(({ value }) =>
    value && typeof value == 'string' ? value?.trim() : '',
  )
  fullName!: string;

  @ApiProperty({ example: 'ada@example.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: '08012345678' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;
}

export class OrderGifterDto {
  @ApiProperty({ example: 'Tunde Bello' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  fullName!: string;

  @ApiProperty({
    description: 'Used as the payment customer email on the payment gateway',
    example: 'tunde@example.com',
  })
  @IsEmail()
  email!: string;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Slug of the ticket to purchase',
    example: 'google-devfest-2026',
  })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty({ type: OrderAttendeeDto })
  @ValidateNested()
  @Type(() => OrderAttendeeDto)
  attendee!: OrderAttendeeDto;

  @ApiPropertyOptional({
    type: OrderGifterDto,
    description: 'Presence indicates the ticket is a gift',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderGifterDto)
  gifter?: OrderGifterDto;
}

export class OrderedTicketDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;
}

export class CreateOrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  reference: string;

  @ApiProperty({ enum: ['AWAITING_PAYMENT'] })
  status: string;

  @ApiProperty({
    type: String,
    description: 'Total amount payable in Naira (2 decimal places)',
    example: '9500.00',
  })
  amount: string;

  @ApiProperty({
    type: String,
    description: 'Discount applied in Naira (2 decimal places)',
    example: '500.00',
  })
  discount: string;

  @ApiProperty({
    type: String,
    description: '7.5% VAT plus payment gateway service charge',
    example: '500.00',
  })
  vatAndCharges: string;

  @ApiProperty()
  currency: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Payment checkout URL to redirect the payer to',
  })
  checkoutUrl: string | null;

  @ApiProperty({ type: Date, format: 'date-time' })
  expiresAt: Date;

  @ApiProperty({ type: OrderedTicketDto })
  ticket: OrderedTicketDto;
}

export class GetOrderReferenceResponseDto {
  @ApiProperty({
    type: 'object',
    properties: {
      name: { type: 'string', example: 'Google DevFest 2026' },
      url: {
        type: 'string',
        example: 'https://example.com/download/ticket.pdf',
      },
      validityDates: {
        type: 'array',
        items: { type: 'string', format: 'date-time' },
        example: ['2026-09-20T00:00:00.000Z', '2026-09-21T00:00:00.000Z'],
      },
    },
  })
  ticket: { name: string; validityDates: Date[]; url: string };

  @ApiProperty({
    type: String,
    description: 'Amount paid in Naira (2 decimal places)',
    example: '9500.00',
  })
  amount: string;

  @ApiProperty({
    enum: [
      'AWAITING_PAYMENT',
      'PAID',
      'CANCELLED',
      'AWAITING_REFUND',
      'REFUNDED',
    ],
  })
  status: string;

  @ApiProperty({
    type: String,
    description: 'Ticket code',
    example: 'ABC123',
  })
  code: string;
}

export class OrdersQueryDto {
  @ApiPropertyOptional({
    description:
      'Search orders by attendee email, attendee full name, or reference (case-insensitive)',
    example: 'ada@example.com',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description:
      'Filter orders by status. When omitted, orders of all statuses are returned.',
    enum: OrderStatus,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    description:
      'Pagination direction. `next` returns earlier-dated orders, `previous` returns more recent orders.',
    enum: ['next', 'previous'],
    default: 'next',
  })
  @IsOptional()
  @IsIn(['next', 'previous'])
  direction?: 'next' | 'previous' = 'next';

  @ApiPropertyOptional({
    description:
      'Cursor for pagination. Pass the ID of the last item from the previous page.',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({
    description: 'Number of results to return per page',
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 50,
  })
  @Transform(({ value }) => Number.parseInt(value || 20, 10))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20;
}

export class OrderListItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: Date, format: 'date-time', nullable: true })
  paidAt: Date | null;

  @ApiProperty({
    type: String,
    description: 'Amount paid in Naira (2 decimal places)',
    example: '9500.00',
  })
  amount: string;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty()
  attendeeFullName: string;

  @ApiProperty()
  attendeeEmail: string;

  @ApiProperty({ type: [String], format: 'date-time' })
  checkIns: Date[];

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string', example: 'Google DevFest 2026' },
      code: { type: 'string', example: 'ABC123' },
      validity: { type: 'string', example: 'Fri + Sat' },
    },
  })
  ticket: { name: string; code: string; validityDates: string };
}

export class OrdersPaginationMetaDto {
  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Cursor to fetch the next page',
  })
  nextCursor: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Cursor to fetch the previous page',
  })
  prevCursor: string | null;

  @ApiProperty({ description: 'Number of results per page' })
  limit: number;

  @ApiProperty({
    description: 'Whether more items exist in the direction of travel',
  })
  hasMore: boolean;
}

export class OrderListResponseDto {
  @ApiProperty({ type: [OrderListItemDto] })
  data: OrderListItemDto[];

  @ApiProperty({ type: OrdersPaginationMetaDto })
  meta: OrdersPaginationMetaDto;
}
