import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Role {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export class InviteAdminDto {
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

  @ApiProperty({
    description: 'Role of the admin',
    example: Role.ADMIN,
    enum: Role,
  })
  @IsEnum(['ADMIN'], { message: 'Only ADMIN role can be invited' })
  role: 'ADMIN';
}
