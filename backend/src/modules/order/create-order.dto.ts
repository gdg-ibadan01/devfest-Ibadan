import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
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
    example: 'early-bird-2026-08-17',
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

  /** Internal — set by AttendeeService when an admin manually creates an order. Not exposed in public API. */
  createdById?: string | null;

  /** Internal — set by AttendeeService to bypass the sale-window date check for admin-created orders. */
  skipSaleWindowCheck?: boolean;
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
