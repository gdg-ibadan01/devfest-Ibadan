import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsNumber,
  IsArray,
  IsPositive,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateEventDto {
  @ApiPropertyOptional({ example: 'Annual Tech Conference 2025' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'A conference bringing together techies' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '2025-08-13T05:00:00Z' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2025-08-14T17:00:00Z' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ example: '2025-09-10T23:59:59Z' })
  @IsDateString()
  @IsOptional()
  registrationStart?: string;

  @ApiPropertyOptional({ example: '2025-09-11T23:59:59Z' })
  @IsDateString()
  @IsOptional()
  registrationEnd?: string;

  @ApiPropertyOptional({ example: 'PUBLISHED' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 500 })
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(10000)
  maxAttendees?: number;

  @ApiPropertyOptional({ example: true })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @ApiPropertyOptional({ example: 150 })
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  bannerImage?: any;

  @ApiPropertyOptional({ example: ['Technology', 'Networking'] })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    try {
      return JSON.parse(value);
    } catch {
      return value ? [value] : [];
    }
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: ['Bring a laptop', 'Install Node.js'] })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    try {
      return JSON.parse(value);
    } catch {
      return value ? [value] : [];
    }
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @ApiPropertyOptional({
    example: {
      day1: ['Opening keynote'],
      day2: ['Hackathon'],
    },
  })
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return value;
    }
  })
  @IsOptional()
  agenda?: Record<string, string[]>;
}
