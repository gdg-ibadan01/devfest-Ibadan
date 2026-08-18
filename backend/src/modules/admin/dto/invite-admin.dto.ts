import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class InviteAdminDto {
  @ApiProperty({ description: 'Full name of the admin', example: 'John Doe' })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Email address of the admin',
    example: 'admin@gdg.com',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'ID of the role to assign to the admin',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsUUID()
  roleId: string;
}
