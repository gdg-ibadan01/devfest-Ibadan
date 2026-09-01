import { IsOptional, IsString, IsEmail, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RefundQueryDto {
  @ApiPropertyOptional({
    description: 'Filter refunds by email address of the buyer',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Pagination direction',
    enum: ['next', 'previous'],
    default: 'next',
  })
  @IsOptional()
  @IsIn(['next', 'previous'])
  direction?: 'next' | 'previous' = 'next';

  @ApiPropertyOptional({
    description:
      'Cursor for pagination. Pass the ID of the last item from the previous page.',
  })
  @IsOptional()
  @IsString()
  cursor?: string;
}
