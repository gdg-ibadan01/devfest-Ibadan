import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({ description: 'Email address', example: 'admin@gdg.com' })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', example: 'StrongPassword123!' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/^[A-Za-z0-9!@#\$%\^\&*\)\(+=._\[\]\/-]{6,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;
}
