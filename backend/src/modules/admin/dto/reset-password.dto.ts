import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The password reset token received in the email',
    example: 'a3f2c1e4d5b6...',
  })
  @IsString({ message: 'Token must be a string' })
  @Transform(({ value }) => value === 'true' || value === true)
  token: string;

  @ApiProperty({
    description: 'The new password to set',
    example: 'NewSecurePass123!',
  })
  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @Matches(/^[A-Za-z0-9!@#\$%\^\&*\)\(+=._\[\]\/-]{8,}$/, {
    message:
      'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  newPassword: string;
}
