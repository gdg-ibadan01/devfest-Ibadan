import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
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
