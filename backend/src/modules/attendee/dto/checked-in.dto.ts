import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CheckedInQueryDto {
  @ApiProperty({
    description: 'Event dates to match check-ins against (YYYY-MM-DD)',
    type: [String],
    isArray: true,
    required: true,
    example: ['2026-09-20', '2026-09-21'],
  })
  @Transform(({ value }: { value: unknown }): string[] => {
    if (Array.isArray(value)) return value as string[];
    if (typeof value === 'string') return value.split(',');
    return [];
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsDateString({}, { each: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    each: true,
    message: 'eventDates items must be in YYYY-MM-DD format',
  })
  eventDates!: string[];

  @ApiPropertyOptional({
    description:
      'Pagination direction. `next` returns earlier-created attendees, `previous` returns more recent attendees.',
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

  @ApiPropertyOptional({
    description: 'Number of results to return per page',
    example: 20,
    default: 20,
    minimum: 10,
    maximum: 50,
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? Number.parseInt(value, 10) : value,
  )
  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(50)
  limit?: number = 20;
}
