import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token', example: 'evAdBCX.........' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
