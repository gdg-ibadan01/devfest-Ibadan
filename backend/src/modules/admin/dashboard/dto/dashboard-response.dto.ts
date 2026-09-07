import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsDateString,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

// ─── Home screen DTOs ────────────────────────────────────────────────────────

export class DashboardStatsDto {
  @ApiProperty({ example: 1247 })
  totalAttendees!: number;

  @ApiProperty({ example: 892 })
  ticketsSold!: number;

  @ApiProperty({ example: 4250000 })
  revenue!: number;

  @ApiProperty({ example: 15, nullable: true })
  daysToEvent!: number | null;

  @ApiProperty({
    example: 640,
    description:
      'Distinct paid attendees who have checked in at least once, across all event days',
  })
  totalCheckedIn!: number;

  @ApiProperty({
    example: 128,
    description: 'Distinct paid attendees who checked in specifically today',
  })
  checkedInToday!: number;
}

export class RegistrationTrendPointDto {
  @ApiProperty({ example: 'Jul' })
  month!: string;

  @ApiProperty({ example: 140 })
  count!: number;
}

export class TicketBreakdownSliceDto {
  @ApiProperty({ example: 'Early Bird' })
  ticketName!: string;

  @ApiProperty({ example: 45 })
  percentage!: number;
}

export class RecentAttendeeDto {
  @ApiProperty({ example: '01918a2b-3c4d-7e8f-9012-3456789abcde' })
  id!: string;

  @ApiProperty({ example: '#WKS-18820' })
  reference!: string;

  @ApiProperty({ example: '2026-07-25T00:00:00.000Z' })
  date!: Date;

  @ApiProperty({ example: 'Adetunji Oluwapeyibomi' })
  fullName!: string;

  @ApiProperty({ example: 'maryesivue@gmail.com' })
  email!: string;

  @ApiProperty({ example: '+234 803 123 4567', nullable: true })
  phone!: string | null;

  @ApiProperty({ example: 'VIP' })
  ticketType!: string;

  @ApiProperty({ example: 8000 })
  amount!: number;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PAID })
  status!: OrderStatus;
}

export class DashboardOverviewResponseDto {
  @ApiProperty({ type: DashboardStatsDto })
  stats!: DashboardStatsDto;

  @ApiProperty({ type: [RegistrationTrendPointDto] })
  registrationTrend!: RegistrationTrendPointDto[];

  @ApiProperty({ type: [TicketBreakdownSliceDto] })
  ticketBreakdown!: TicketBreakdownSliceDto[];

  @ApiProperty({ type: [RecentAttendeeDto] })
  recentAttendees!: RecentAttendeeDto[];
}

// ─── Attendees list screen DTOs ──────────────────────────────────────────────

export class AttendeeListQueryDto {
  @ApiPropertyOptional({
    description: 'Search by name, email, phone or reference',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: [
      'ALL',
      'CHECKED_IN',
      'REGISTERED',
      'PENDING',
      ...Object.values(OrderStatus),
    ],
    description:
      'Filter by status. Accepts ALL, CHECKED_IN (paid with >= 1 check-in), REGISTERED (paid with no check-in), PENDING / AWAITING_PAYMENT, CANCELLED, etc.',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by ticket ID' })
  @IsOptional()
  @IsString()
  ticketId?: string;

  @ApiPropertyOptional({
    example: '2024-12-01',
    description: 'Inclusive start date (ISO 8601)',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    example: '2024-12-31',
    description: 'Inclusive end date (ISO 8601)',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({
    description: 'Cursor for next-page pagination (order ID)',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({
    description: 'Pagination direction',
    enum: ['next', 'previous'],
    default: 'next',
  })
  @IsOptional()
  @IsIn(['next', 'previous'])
  direction?: 'next' | 'previous' = 'next';

  @ApiPropertyOptional({ default: 20, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

export class AttendeeListSummaryDto {
  @ApiProperty({
    example: 1247,
    description: 'Total registrations across all statuses',
  })
  total!: number;

  @ApiProperty({
    example: 643,
    description: 'Attendees with at least one check-in',
  })
  checkedIn!: number;

  @ApiProperty({
    example: 412,
    description: 'Orders in AWAITING_PAYMENT status',
  })
  pending!: number;

  @ApiProperty({ example: 192, description: 'Orders in CANCELLED status' })
  cancelled!: number;
}

export class AttendeeListItemDto {
  @ApiProperty({ example: '01918a2b-3c4d-7e8f-9012-3456789abcde' })
  id!: string;

  @ApiProperty({ example: '#WKS-18820' })
  reference!: string;

  @ApiProperty({ example: 'Tunde Olanrewaju' })
  name!: string;

  @ApiProperty({ example: 't.olanrewaju@gmail.com' })
  email!: string;

  @ApiProperty({ example: '+234 803 123 4567', nullable: true })
  phone!: string | null;

  @ApiProperty({ example: 'VIP' })
  ticketType!: string;

  @ApiProperty({ example: '2024-12-12T00:00:00.000Z' })
  regDate!: Date;

  @ApiProperty({ example: 15000 })
  amountPaid!: number;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PAID })
  status!: OrderStatus;

  @ApiProperty({
    example: 'Checked-in',
    description:
      'Human-readable status for UI badge: Checked-in, Registered, Pending, Cancelled, etc.',
  })
  displayStatus!: string;

  @ApiProperty({
    example: true,
    description: 'True if attendee has checked in at least once',
  })
  isCheckedIn!: boolean;

  @ApiProperty({ example: ['2026-09-06T15:00:00.000Z'], type: [Date] })
  checkIns!: Date[];
}

export class AttendeeListPaginationMetaDto {
  @ApiProperty({ example: 'some-uuid', nullable: true })
  nextCursor!: string | null;

  @ApiProperty({ example: 'some-uuid', nullable: true })
  prevCursor!: string | null;

  @ApiProperty({ example: 20 })
  limit!: number;

  @ApiProperty({ example: true })
  hasMore!: boolean;
}

export class AttendeeListResponseDto {
  @ApiProperty({ type: AttendeeListSummaryDto })
  summary!: AttendeeListSummaryDto;

  @ApiProperty({ type: [AttendeeListItemDto] })
  data!: AttendeeListItemDto[];

  @ApiProperty({ type: AttendeeListPaginationMetaDto })
  meta!: AttendeeListPaginationMetaDto;
}
