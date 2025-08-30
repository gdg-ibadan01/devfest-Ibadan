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
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateEventDto {
  @ApiProperty({
    description: 'The title of the event.',
    example: 'Google Developer Group Summit 2025',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'A detailed description of the event.',
    example:
      'An annual tech conference bringing together developers, designers, and tech enthusiasts.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The venue where the event will be held.',
    example: 'Lagos Tech Hub',
  })
  @IsString()
  @IsNotEmpty()
  venue: string;

  @ApiProperty({
    description: 'The complete address of the event location.',
    example: '123 Tech Street, Victoria Island, Lagos, Nigeria',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'The start date and time of the event (ISO 8601 format).',
    example: '2025-09-15T09:00:00Z',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'The end date and time of the event (ISO 8601 format).',
    example: '2025-09-17T17:00:00Z',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'The date and time when registration opens (ISO 8601 format).',
    example: '2025-08-01T00:00:00Z',
  })
  @IsDateString()
  registrationStart: string;

  @ApiProperty({
    description:
      'The date and time when registration closes (ISO 8601 format).',
    example: '2025-09-10T23:59:59Z',
  })
  @IsDateString()
  registrationEnd: string;

  @ApiProperty({
    description: 'Maximum number of attendees allowed for the event.',
    example: 500,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(10000)
  @Transform(({ value }) => parseInt(value))
  maxAttendees: number;

  @ApiProperty({
    description: 'Indicates if the event is paid (true) or free (false).',
    example: true,
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isPaid: boolean;

  @ApiPropertyOptional({
    description: 'Price of the event ticket (if paid).',
    example: 150.0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  price?: number;

  @ApiPropertyOptional({
    description: 'URL of the banner image for the event.',
    example: 'https://example.com/images/event-banner.jpg',
  })
  @IsOptional()
  @IsUrl()
  bannerImage?: string;

  @ApiPropertyOptional({
    description: 'Tags for categorizing the event.',
    example: ['Technology', 'Conference', 'Networking'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'List of requirements for attending the event.',
    example: ['Bring a laptop', 'Install Node.js', 'Register online'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @ApiPropertyOptional({
    description: 'Event agenda in JSON format.',
    example: {
      day1: ['Opening keynote', 'Workshop: NestJS Basics'],
      day2: ['Panel discussion', 'Hackathon'],
    },
  })
  @IsOptional()
  agenda?: any;
}
