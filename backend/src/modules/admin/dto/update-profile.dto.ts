import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Full name of the admin',
    example: 'Jane Doe',
  })
  @ValidateIf((o) => !o.email || o.fullName !== undefined)
  @IsNotEmpty({
    message: 'At least one field (fullName or email) must be provided',
  })
  @IsString({ message: 'Full name must be a string' })
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  fullName?: string;

  @ApiPropertyOptional({
    description: 'New email address for the admin account',
    example: 'newemail@gdgibadan.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;
}
