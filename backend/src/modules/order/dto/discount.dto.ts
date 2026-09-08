import { BadRequestException } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DiscountType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Min,
  IsNumber,
  Max,
} from 'class-validator';

export class DiscountByCodeResponseDto {
  @ApiProperty({
    type: String,
    example: '1000.00',
    description: 'The discount amount',
  })
  amount: string;

  @ApiProperty({ description: 'Whether the discount is currently active' })
  isActive: boolean;
}

export class CreateDiscountResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ enum: DiscountType })
  type: DiscountType;

  @ApiProperty({
    type: String,
    description: 'Discount amount (2 decimal places)',
    example: '1000.00',
  })
  amount: string;

  @ApiProperty({ type: [String] })
  ticketSlugs: string[];

  @ApiProperty({ type: Number })
  limit: number;

  @ApiProperty({ type: Date, format: 'date-time' })
  validFrom: Date;

  @ApiProperty({ type: Date, format: 'date-time', nullable: true })
  validTo: Date | null;

  @ApiProperty()
  forFirstTimersOnly: boolean;

  @ApiProperty({ type: [String] })
  recipientEmails: string[];

  @ApiProperty({ type: Date, format: 'date-time' })
  createdAt: Date;
}

export class CreateDiscountDto {
  @ApiProperty({ example: 'DevFest2026 Early Bird' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name!: string;

  @ApiProperty({ enum: DiscountType, example: DiscountType.SINGLE })
  @IsEnum(DiscountType)
  type!: DiscountType;

  @ApiProperty({
    minimum: 1,
    example: 1000.0,
    description: 'Discount amount with 2 decimal places',
  })
  @IsNotEmpty()
  @Min(1)
  @IsNumber({ maxDecimalPlaces: 2 })
  amount!: number;

  @ApiProperty({
    type: [String],
    example: ['devfest2026-gdsc-discount', 'devfest2026-student-discount'],
    description: 'Array of ticket slugs this discount applies to',
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  ticketSlugs!: string[];

  @ApiProperty({
    minimum: 1,
    example: 100,
    description:
      'Maximum number of times this discount can be used. Required for BULK discounts.',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  limit!: number;

  @ApiProperty({
    example: '2026-01-01',
    description: 'Date string in YYYY-MM-DD format',
  })
  @IsDateString()
  validFrom!: string;

  @ApiProperty({
    example: '2026-12-31',
    description:
      'End date in YYYY-MM-DD format. Discount expires at end of day.',
  })
  @IsDateString()
  validTo!: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  forFirstTimersOnly?: boolean = false;

  @ApiPropertyOptional({
    type: [String],
    example: ['user1@example.com', 'user2@example.com'],
    description:
      'Required for BULK discounts. Array length cannot exceed limit.',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recipientEmails?: string[];

  validateForType(): void {
    const isBulk = this.type === 'BULK';

    if (isBulk && !this.limit) {
      throw new BadRequestException('limit required for BULK discounts');
    }

    if (isBulk && !this.recipientEmails?.length) {
      throw new BadRequestException(
        'Recipient emails required for BULK discounts',
      );
    }

    if (
      isBulk &&
      this.recipientEmails &&
      this.recipientEmails.length > this.limit
    ) {
      throw new BadRequestException('Recipient emails cannot exceed limit');
    }
  }
}

export class DiscountListQueryDto {
  @ApiPropertyOptional({
    description: 'Filter discounts by name (case-insensitive)',
    example: 'GDSC 2026 Discount',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description:
      'Pagination direction. `next` returns earlier-created discounts, `previous` returns more recent discounts.',
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
    minimum: 1,
    maximum: 50,
  })
  @Transform(({ value }) => Number.parseInt(value || 20, 10))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20;
}

export class DiscountListTicketDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class DiscountListItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: DiscountType })
  type: DiscountType;

  @ApiProperty({
    type: String,
    description: 'Discount amount (2 decimal places)',
    example: '1000.00',
  })
  amount: string;

  @ApiProperty({
    description: 'Number of paid orders linked to this discount',
  })
  usage: number;

  @ApiProperty({
    type: String,
    description: 'Valid from date in YYYY-MM-DD format',
    example: '2026-01-01',
  })
  validFrom: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ type: Number })
  limit: number;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'End date in YYYY-MM-DD format',
  })
  validTo: string | null;

  @ApiProperty({ enum: ['SCHEDULED', 'ACTIVE', 'EXPIRED'] })
  status: 'SCHEDULED' | 'ACTIVE' | 'EXPIRED';

  @ApiProperty({ type: Date, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({
    type: [DiscountListTicketDto],
    description: 'Tickets this discount applies to',
  })
  tickets: DiscountListTicketDto[];
}

export class DiscountPaginationMetaDto {
  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Cursor to fetch the next page',
  })
  nextCursor: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Cursor to fetch the previous page',
  })
  prevCursor: string | null;

  @ApiProperty({ description: 'Number of results per page' })
  limit: number;

  @ApiProperty({
    description: 'Whether more items exist in the direction of travel',
  })
  hasMore: boolean;
}

export class DiscountListResponseDto {
  @ApiProperty({ type: [DiscountListItemDto] })
  data: DiscountListItemDto[];

  @ApiProperty({ type: DiscountPaginationMetaDto })
  meta: DiscountPaginationMetaDto;
}
