import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token', example: 'evAdBCX.........' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  refreshToken: string;
}
