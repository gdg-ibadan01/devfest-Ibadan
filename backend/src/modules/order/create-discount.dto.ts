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
  Length,
  Min,
} from 'class-validator';

export class CreateDiscountDto {
  @ApiProperty({ example: 'DevFest2026 Early Bird' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name!: string;

  @ApiProperty({ enum: DiscountType, example: DiscountType.SINGLE })
  @IsEnum(DiscountType)
  type!: DiscountType;

  @ApiProperty({
    example: 1000.0,
    description: 'Discount amount with 2 decimal places',
  })
  @IsNotEmpty()
  amount!: number;

  @ApiProperty({
    type: [String],
    example: ['early-bird', 'vip'],
    description: 'Array of ticket slugs this discount applies to',
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  ticketSlugs!: string[];

  @ApiPropertyOptional({
    example: 100,
    description:
      'Maximum number of times this discount can be used. Required for BULK discounts. Set to null for unlimited.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number | null;

  @ApiProperty({
    example: '2026-01-01',
    description: 'Date string in YYYY-MM-DD format',
  })
  @IsDateString()
  validFrom!: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  forFirstTimersOnly?: boolean;

  @ApiPropertyOptional({
    type: [String],
    example: ['user1@example.com', 'user2@example.com'],
    description: 'Required for BULK discounts. Cannot exceed capacity.',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recipientEmails?: string[];

  validateForType(): void {
    const isBulk = this.type === 'BULK';

    if (isBulk && !this.capacity) {
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
      this.recipientEmails.length > this.capacity!
    ) {
      throw new BadRequestException('Recipient emails cannot exceed capacity');
    }
  }
}
