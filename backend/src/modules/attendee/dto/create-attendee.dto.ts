import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsValidPhoneNumber } from '../../../common/validators/phone.validator';

export class CreateAttendeeDto {
  @ApiProperty({
    description: 'Attendee email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Full name of the attendee',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  fullName: string;

  @ApiPropertyOptional({
    description: 'Attendee phone number (E.164 format)',
    example: '+2348012345678',
  })
  @IsValidPhoneNumber()
  @IsOptional({ message: 'Phone number must be a string' })
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Name of the company',
    example: 'Flutterwave Nigeria LTD',
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  company?: string;

  @ApiPropertyOptional({
    description: 'Job title of the attendee',
    example: 'Software Engineer',
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  jobTitle?: string;
}
