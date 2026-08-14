import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Registered email address of the admin',
    example: 'admin@gdgibadan.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}
