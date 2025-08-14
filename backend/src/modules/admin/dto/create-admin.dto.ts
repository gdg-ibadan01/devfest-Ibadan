import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Role {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export class CreateAdminDto {
  @ApiProperty({ description: 'Full name of the admin', example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Email address of the admin',
    example: 'admin@gdg.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User password', example: 'StrongPassword123!' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^[A-Za-z0-9!@#\$%\^\&*\)\(+=._\[\]\/-]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({
    description: 'Role of the admin',
    example: Role.ADMIN,
    enum: Role,
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Role must be either ADMIN or SUPER_ADMIN' })
  role?: Role;
}
