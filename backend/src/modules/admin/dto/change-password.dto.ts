import { IsString, MinLength, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password of the user',
    example: 'CurrentPass123!',
  })
  @IsString({ message: 'Current password must be a string' })
  @IsNotEmpty({ message: 'Current password is required' })
  @MinLength(8, {
    message: 'Current password must be at least 8 characters long',
  })
  @Matches(/^[A-Za-z0-9!@#\$%\^\&*\)\(+=._\[\]\/-]{8,}$/, {
    message:
      'Current password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  currentPassword: string;

  @ApiProperty({
    description: 'New password to set',
    example: 'NewPass123!',
  })
  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @Matches(/^[A-Za-z0-9!@#\$%\^\&*\)\(+=._\[\]\/-]{8,}$/, {
    message:
      'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  newPassword: string;
}
