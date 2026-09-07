import { ApiProperty } from '@nestjs/swagger';

export class AttendeeTicketDto {
  @ApiProperty({ example: 'friday-workshop-2025' })
  slug!: string;

  @ApiProperty({ example: 'Friday Workshop' })
  name!: string;
}

export class AttendeeResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  reference!: string;

  @ApiProperty({ type: AttendeeTicketDto })
  ticket!: AttendeeTicketDto;

  @ApiProperty({
    type: String,
    description: 'Total amount payable in Naira (2 decimal places)',
    example: '4000.00',
  })
  amount!: string;

  @ApiProperty({
    type: String,
    description: 'Discount applied in Naira (2 decimal places)',
    example: '0.00',
  })
  discount!: string;

  @ApiProperty({ example: 'NGN' })
  currency!: string;

  @ApiProperty({ enum: ['AWAITING_PAYMENT'], example: 'AWAITING_PAYMENT' })
  status!: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Monnify checkout URL',
  })
  checkoutUrl!: string | null;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    description: 'Order expiry timestamp',
  })
  expiresAt!: Date;
}
