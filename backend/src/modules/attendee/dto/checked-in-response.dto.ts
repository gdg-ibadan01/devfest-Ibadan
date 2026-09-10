import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class CheckedInListItemDto {
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
  ticket: { id: string; name: string; code: string; validity: string };
}

export class CheckedInPaginationMetaDto {
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

export class CheckedInListResponseDto {
  @ApiProperty({ type: [CheckedInListItemDto] })
  data: CheckedInListItemDto[];

  @ApiProperty({ type: CheckedInPaginationMetaDto })
  meta: CheckedInPaginationMetaDto;
}
