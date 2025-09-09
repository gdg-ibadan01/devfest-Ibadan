import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsPositive,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateEventDto {
  @ApiProperty({ example: 'Google Developer Group Summit 2025' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Annual tech conference...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Lagos Tech Hub' })
  @IsString()
  @IsNotEmpty()
  venue: string;

  @ApiProperty({ example: '123 Tech Street, Victoria Island, Lagos' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '2025-09-15T09:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-09-17T17:00:00Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: '2025-08-01T00:00:00Z' })
  @IsDateString()
  registrationStart: string;

  @ApiProperty({ example: '2025-09-10T23:59:59Z' })
  @IsDateString()
  registrationEnd: string;

  @ApiProperty({ example: 500 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(10000)
  maxAttendees: number;

  @ApiProperty({ example: true })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isPaid: boolean;

  @ApiPropertyOptional({ example: 150 })
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  bannerImage?: any;

  @ApiPropertyOptional({ example: ['Technology', 'Conference'] })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    try {
      return JSON.parse(value);
    } catch {
      return [value];
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
      return [value];
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
