import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminActionResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Operation successful',
  })
  message: string;
}
