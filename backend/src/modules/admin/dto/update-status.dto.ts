import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class UpdateAdminStatusDto {
  @ApiProperty({
    description: 'ID of the admin whose status will be updated',
    example: 'b2d57e13-0e2c-4a6c-bf67-cc6e90cbedf8',
  })
  @IsString()
  adminId: string;

  @ApiProperty({
    description: 'Whether the admin account is active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;
}
