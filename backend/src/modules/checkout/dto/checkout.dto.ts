import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { OrderStatus } from '@prisma/client';
import { CheckoutSessionDto } from 'src/modules/order/dto/order.dto';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class VerifyCheckoutDto {
  @ApiProperty({
    description: 'Our order reference',
    example: 'DevFest-AB12CD',
  })
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  reference!: string;

  @ApiPropertyOptional({
    description:
      "Gateway transaction id from the popup (ALATPay transactionId / Monnify transactionReference). Omit when the popup didn't return one (ALATPay card payments): the order's completed transaction is then looked up on the gateway.",
  })
  @Transform(trim)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  transactionRef?: string;
}

export class VerifyCheckoutResponseDto {
  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty({
    enum: [
      'PROCESSED',
      'DUPLICATE',
      'NOT_COMPLETED',
      'REJECTED',
      'IGNORED',
      'ALREADY_FINAL',
    ],
  })
  outcome: string;
}

export class CheckoutSessionResponseDto {
  @ApiProperty()
  reference: string;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty({ enum: ['ALATPAY', 'MONNIFY'] })
  provider: string;

  @ApiProperty({ example: '9500.00' })
  amount: string;

  @ApiProperty({ example: 'NGN' })
  currency: string;

  @ApiProperty({ type: Date, format: 'date-time' })
  expiresAt: Date;

  @ApiProperty({
    type: 'object',
    properties: { name: { type: 'string' } },
  })
  ticket: { name: string };

  @ApiPropertyOptional({ type: CheckoutSessionDto, nullable: true })
  payment: CheckoutSessionDto | null;
}

export class ReconciliationOrderDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  reference: string;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty()
  attendeeFullName: string;

  @ApiProperty()
  attendeeEmail: string;

  @ApiProperty()
  ticketName: string;

  @ApiProperty({ example: '9500.00' })
  amount: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;
}

export class ReconciliationItemDto {
  @ApiProperty({ description: 'ALATPay transaction id' })
  transactionRef: string;

  @ApiProperty({ description: 'Amount paid on the gateway, in Naira' })
  amount: number;

  @ApiProperty({ example: 'NGN' })
  currency: string;

  @ApiProperty({ type: String, nullable: true })
  paidAt: string | null;

  @ApiProperty({
    enum: ['ORDER_NOT_PAID', 'ORDER_NOT_FOUND'],
    description:
      'ORDER_NOT_PAID: gateway says paid, our order is not PAID. ORDER_NOT_FOUND: the transaction carries no order we know.',
  })
  issue: 'ORDER_NOT_PAID' | 'ORDER_NOT_FOUND';

  @ApiProperty({ type: ReconciliationOrderDto, nullable: true })
  order: ReconciliationOrderDto | null;
}

export class ReconciliationResponseDto {
  @ApiProperty({ type: String, format: 'date-time' })
  since: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  until: Date;

  @ApiProperty({ enum: ['ALATPAY'] })
  gateway: 'ALATPAY';

  @ApiProperty({ description: 'False when ALATPay credentials are missing' })
  configured: boolean;

  @ApiProperty({ description: 'Completed gateway transactions examined' })
  scanned: number;

  @ApiProperty({ type: [ReconciliationItemDto] })
  items: ReconciliationItemDto[];
}

export class ReconciliationQueryDto {
  @ApiPropertyOptional({
    description: 'Look-back window in hours (1–48)',
    default: 6,
    minimum: 1,
    maximum: 48,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(48)
  hours?: number = 6;
}

export class ReconcileConfirmDto {
  @ApiProperty({ description: 'ALATPay transaction id from the list' })
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  transactionRef!: string;
}

export class ReconcileConfirmResponseDto {
  @ApiProperty({
    enum: ['PROCESSED', 'DUPLICATE', 'NOT_COMPLETED', 'REJECTED', 'IGNORED'],
  })
  outcome: string;

  @ApiProperty({ type: String, nullable: true })
  reason: string | null;

  @ApiProperty({ enum: OrderStatus, nullable: true })
  orderStatus: OrderStatus | null;

  @ApiProperty({ type: String, nullable: true })
  reference: string | null;
}
