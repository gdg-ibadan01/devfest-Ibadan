import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEventDto {
  @ApiPropertyOptional({
    description: 'Title of the event',
    example: 'Annual Tech Conference 2025',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Description of the event',
    example:
      'A conference bringing together tech enthusiasts from all over the world.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Event start date in ISO 8601 format',
    example: '2025-08-13T05:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string; // must be string for IsDateString

  @ApiPropertyOptional({
    description: 'Event end date in ISO 8601 format',
    example: '2025-08-14T17:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string; // must be string for IsDateString

  @ApiPropertyOptional({
    description: 'Registration start date in ISO 8601 format',
    example: '2025-09-10T23:59:59Z',
  })
  @IsDateString()
  @IsOptional()
  registrationStart?: string;

  @ApiPropertyOptional({
    description: 'Registration end date in ISO 8601 format',
    example: '2025-09-11T23:59:59Z',
  })
  @IsDateString()
  @IsOptional()
  registrationEnd?: string;

  @ApiPropertyOptional({
    description: 'Event status',
    example: 'PUBLISHED',
  })
  @IsString()
  @IsOptional()
  status?: string;
}
