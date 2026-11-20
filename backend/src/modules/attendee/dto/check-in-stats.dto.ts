import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class CheckInStatsQueryDto {
  @ApiPropertyOptional({
    description:
      'Event day to report on (YYYY-MM-DD). Defaults to today in the venue timezone.',
    example: '2026-11-21',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be YYYY-MM-DD' })
  date?: string;

  @ApiPropertyOptional({ description: 'Limit the stats to one ticket' })
  @IsOptional()
  @IsString()
  ticketId?: string;
}

export class CheckInStatsTicketDto {
  @ApiProperty()
  ticketId!: string;

  @ApiProperty({ example: 'Regular' })
  ticketName!: string;

  @ApiProperty({
    example: 850,
    description: 'Paid orders for this ticket valid on the day',
  })
  expected!: number;

  @ApiProperty({ example: 312 })
  checkedIn!: number;

  @ApiProperty({ example: 538 })
  remaining!: number;

  @ApiProperty({ example: 36.7, description: 'Percentage, 1 decimal place' })
  checkInRate!: number;
}

export class CheckInStatsHourDto {
  @ApiProperty({ example: 9, description: 'Hour of day (0–23), venue time' })
  hour!: number;

  @ApiProperty({ example: 140 })
  count!: number;
}

export class CheckInStatsStaffDto {
  @ApiProperty()
  adminId!: string;

  @ApiProperty({ example: 'Ada Lovelace' })
  fullName!: string;

  @ApiProperty({ example: 120, description: 'Successful check-ins on the day' })
  checkIns!: number;

  @ApiProperty({
    example: 3,
    description: 'Scans of tickets that were already checked in',
  })
  duplicateScans!: number;

  @ApiProperty({ example: 1 })
  undos!: number;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  lastActivityAt!: Date | null;
}

export class CheckInStatsResponseDto {
  @ApiProperty({ example: '2026-11-21' })
  date!: string;

  @ApiProperty({ example: 'Africa/Lagos' })
  timezone!: string;

  @ApiProperty({
    example: 1200,
    description: 'Paid orders whose ticket is valid on `date`',
  })
  expected!: number;

  @ApiProperty({ example: 430, description: 'Of those, checked in on `date`' })
  checkedIn!: number;

  @ApiProperty({ example: 770 })
  remaining!: number;

  @ApiProperty({ example: 35.8, description: 'Percentage, 1 decimal place' })
  checkInRate!: number;

  @ApiProperty({
    example: 430,
    description: 'Paid orders with at least one check-in on any day',
  })
  totalCheckedInAllDays!: number;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  lastCheckInAt!: Date | null;

  @ApiProperty({ type: [CheckInStatsTicketDto] })
  byTicket!: CheckInStatsTicketDto[];

  @ApiProperty({
    type: [CheckInStatsHourDto],
    description: 'Check-ins per hour on `date` (only hours with activity)',
  })
  byHour!: CheckInStatsHourDto[];

  @ApiProperty({
    type: [CheckInStatsStaffDto],
    description:
      'Check-in activity per staff member on `date`, from the audit log (only check-ins made after audit logging was added are attributed)',
  })
  byStaff!: CheckInStatsStaffDto[];
}
