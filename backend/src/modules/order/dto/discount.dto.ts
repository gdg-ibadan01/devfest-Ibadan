import { BadRequestException } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DiscountType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Min,
  IsNumber,
} from 'class-validator';

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

  @ApiProperty({ type: Number, nullable: true })
  limit: number | null;

  @ApiProperty({ type: Date, format: 'date-time' })
  validFrom: Date;

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

  @ApiPropertyOptional({
    minimum: 1,
    example: 100,
    description:
      'Maximum number of times this discount can be used. Required for BULK discounts. Set to null for unlimited.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number | null;

  @ApiProperty({
    example: '2026-01-01',
    description: 'Date string in YYYY-MM-DD format',
  })
  @IsDateString()
  validFrom!: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  forFirstTimersOnly?: boolean = false;

  @ApiPropertyOptional({
    type: [String],
    example: ['user1@example.com', 'user2@example.com'],
    description:
      'Required for BULK discounts. Array length cannot exceed capacity.',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recipientEmails?: string[];

  validateForType(): void {
    const isBulk = this.type === 'BULK';

    if (isBulk && !this.limit) {
      throw new BadRequestException('Capacity required for BULK discounts');
    }

    if (isBulk && !this.recipientEmails?.length) {
      throw new BadRequestException(
        'Recipient emails required for BULK discounts',
      );
    }

    if (
      isBulk &&
      this.recipientEmails &&
      this.recipientEmails.length > this.limit!
    ) {
      throw new BadRequestException('Recipient emails cannot exceed capacity');
    }
  }
}
