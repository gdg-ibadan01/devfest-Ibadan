import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EventStatus } from '../../../common/enums/event-status.enum';

export class EventQueryDto {
  @ApiPropertyOptional({
    description:
      'Search keyword to filter events by title, description, or other relevant fields.',
    example: 'developer conference',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter events by their current status.',
    enum: EventStatus,
    example: EventStatus.PUBLISHED,
  })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @ApiPropertyOptional({
    description:
      'Filter events starting on or after this date (ISO 8601 format).',
    example: '2025-09-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description:
      'Filter events ending on or before this date (ISO 8601 format).',
    example: '2025-09-30T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Filter events by a specific tag.',
    example: 'JavaScript',
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination.',
    default: 1,
    example: 2,
  })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of results per page.',
    default: 10,
    example: 20,
  })
  @IsOptional()
  limit?: number = 10;
}
