import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, RefundStatus } from '@prisma/client';

class RefundTicketDto {
  @ApiProperty({ description: 'Name of the ticket' })
  name: string;
}

class RefundOrderDto {
  @ApiProperty({ description: 'ID of the order' })
  id: string;

  @ApiProperty({ description: 'Status of the order', enum: OrderStatus })
  status: OrderStatus;

  @ApiPropertyOptional({
    description: 'Ticket associated with the order',
    type: RefundTicketDto,
    nullable: true,
  })
  ticket: RefundTicketDto | null;
}

export class RefundListItemDto {
  @ApiProperty({ description: 'ID of the refund' })
  id: string;

  @ApiProperty({ description: 'Email of the refund requestor' })
  email: string;

  @ApiProperty({ description: 'Payment provider used' })
  provider: string;

  @ApiProperty({
    description: 'Current status of the refund',
    enum: RefundStatus,
  })
  status: RefundStatus;

  @ApiPropertyOptional({
    description: 'Timestamp when the refund was completed',
    type: Date,
    nullable: true,
  })
  refundedAt: Date | null;

  @ApiPropertyOptional({
    description: 'Reason for the refund',
    nullable: true,
  })
  reason: string | null;

  @ApiPropertyOptional({
    description: 'Order associated with the refund',
    type: RefundOrderDto,
    nullable: true,
  })
  order: RefundOrderDto | null;

  @ApiProperty({ description: 'Timestamp when the refund was created' })
  createdAt: Date;
}

export class RefundPaginationMetaDto {
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

  @ApiProperty({
    description: 'Whether more items exist in the forward direction',
  })
  hasMore: boolean;
}

export class RefundListResponseDto {
  @ApiProperty({ type: [RefundListItemDto] })
  data: RefundListItemDto[];

  @ApiProperty({ type: RefundPaginationMetaDto })
  meta: RefundPaginationMetaDto;
}
