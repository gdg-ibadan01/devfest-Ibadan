import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateAttendeeDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @Transform(({ value }) => value?.trim())
  @ApiProperty({
    description: 'Attendee full name',
    example: 'Adetunji Oluwapeyibomi',
  })
  fullName!: string;

  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  @ApiProperty({
    description: 'Attendee email address',
    example: 'maryesivue@gmail.com',
  })
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiPropertyOptional({
    description: 'Attendee phone number',
    example: '08103030303',
  })
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Slug of the selected ticket package',
    example: 'friday-workshop-2025',
  })
  ticketSlug!: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  @Transform(({ value }) => value?.trim())
  @ApiPropertyOptional({
    description: 'Name of the person paying, if this ticket is being gifted',
    example: 'Akinlolu Peter',
  })
  gifterName?: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  @ApiPropertyOptional({
    description: "Gifter's email, if this ticket is being gifted",
  })
  gifterEmail?: string;
}
