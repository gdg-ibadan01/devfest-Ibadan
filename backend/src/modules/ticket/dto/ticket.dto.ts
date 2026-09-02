import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsArray,
  Matches,
  IsNumber,
  Min,
  IsInt,
  ArrayMinSize,
  ArrayMaxSize,
  IsDateString,
  IsIn,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ServiceError } from 'src/common/errors/service-error';

export class TicketQueryDto {
  @ApiPropertyOptional({
    description:
      'Cursor for pagination. Pass the ID of the last item from the previous page.',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({
    description: 'Pagination direction',
    enum: ['next', 'previous'],
    default: 'next',
  })
  @IsOptional()
  @IsIn(['next', 'previous'])
  direction?: 'next' | 'previous' = 'next';

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

  @ApiPropertyOptional({
    description: 'Ticket name (case-insensitive)',
    example: 'Early Bird',
  })
  @IsOptional()
  @IsString()
  name?: string;
}

export class TicketListItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [String], format: 'date-time' })
  eventDates: Date[];

  @ApiProperty({
    type: String,
    description: 'Price in Naira (formatted to 2 decimal places)',
    example: '10000.00',
  })
  price: string;

  @ApiProperty({
    type: String,
    description: 'Discount in Naira (formatted to 2 decimal places)',
    example: '500.00',
  })
  discount: string;

  @ApiProperty({ type: Date, format: 'date-time' })
  saleStartsAt: Date;

  @ApiProperty({ type: Date, format: 'date-time' })
  saleEndsAt: Date;

  @ApiProperty()
  capacity: number;

  @ApiProperty()
  slug: string;
}

export class TicketPaginationMetaDto {
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
    description: 'Whether more items exist in the forward direction',
  })
  hasMore: boolean;
}

export class TicketListResponseDto {
  @ApiProperty({ type: [TicketListItemDto] })
  data: TicketListItemDto[];

  @ApiProperty({ type: TicketPaginationMetaDto })
  meta: TicketPaginationMetaDto;
}

export class OnSaleTicketQueryDto {
  @ApiPropertyOptional({
    description: 'Filter tickets by name (case-insensitive)',
    example: 'Early Bird',
  })
  @IsOptional()
  @IsString()
  name?: string;
}

export class OnSaleTicketItemDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ type: [String], format: 'date-time' })
  validityDates: Date[];

  @ApiProperty({ type: [String], format: 'date-time' })
  eventDates: Date[];

  @ApiProperty({
    type: String,
    description: 'Price in Naira (formatted to 2 decimal places)',
    example: '10000.00',
  })
  price: string;

  @ApiProperty({
    type: String,
    description: 'Discount in Naira (formatted to 2 decimal places)',
    example: '500.00',
  })
  discount: string;
}

export class OnSaleTicketResponseDto {
  @ApiProperty({ type: [OnSaleTicketItemDto] })
  data: OnSaleTicketItemDto[];
}

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @ApiProperty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @ApiProperty()
  description!: string;

  @ApiProperty({
    example: ['2026-08-17', '2026-08-18'],
    description: 'Event dates in YYYY-MM-DD format',
    type: [String],
    minLength: 1,
    maxLength: 2,
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
    each: true,
    message: 'eventDates must be in YYYY-MM-DD format',
  })
  eventDates!: string[];

  @ApiProperty({
    description: 'Price of ticket in Naira',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price!: number;

  @ApiPropertyOptional({
    description: 'Ticket discount in Naira',
    default: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  discount: number = 0;

  @ApiProperty({
    example: ['2026-08-17', '2026-08-18'],
    description:
      'Validity dates in YYYY-MM-DD format. Each date must be present in `eventDates`',
    type: [String],
    minLength: 1,
    maxLength: 2,
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
    each: true,
    message: 'validityDates must be in YYYY-MM-DD format',
  })
  validityDates: string[];

  @ApiProperty({
    description: 'Maximum units of this ticket available for sale',
  })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({
    type: Date,
    description: 'Sales will start at the beginning of this day',
  })
  @IsDateString({})
  saleStartsAt: string;

  @ApiProperty({
    type: Date,
    description: 'Sales will end at the end of this day',
  })
  @IsDateString()
  saleEndsAt: string;

  private priceGreaterThanDiscount(): boolean {
    return this.price > this.discount;
  }

  private validityDatesMatchEventDates(): boolean {
    return this.validityDates.every((vd) => this.eventDates.includes(vd));
  }

  private saleEndsAfterStart(): boolean {
    return this.saleEndsAt > this.saleStartsAt;
  }

  /** @throws ValidationErr */
  ensureValidInputs() {
    if (!this.priceGreaterThanDiscount()) {
      throw new ServiceError(
        'discount cannot be greater than price',
        'ValidationErr',
      );
    }

    if (!this.validityDatesMatchEventDates()) {
      throw new ServiceError(
        'eventDates and validityDates mismatch',
        'ValidationErr',
      );
    }

    if (!this.saleEndsAfterStart()) {
      throw new ServiceError(
        'salesEndsAt must be after salesStartsAt',
        'ValidationErr',
      );
    }
  }
}

export class GetTicketBySlugResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    type: String,
    description: 'Price in Naira (formatted to 2 decimal places)',
    example: '10000.00',
  })
  price: string;

  @ApiProperty({
    type: String,
    description: 'Discount in Naira (formatted to 2 decimal places)',
    example: '500.00',
  })
  discount: string;

  @ApiProperty({ type: [Date], format: 'date-time' })
  eventDates: Date[];

  @ApiProperty({ type: [Date], format: 'date-time' })
  validityDates: Date[];

  @ApiProperty()
  slug: string;
}

export class TicketCreatorDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  role: string;
}

export class GetTicketResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: [String], format: 'date-time' })
  eventDates: Date[];

  @ApiProperty({
    type: String,
    description: 'Price in Naira (formatted to 2 decimal places)',
    example: '10000.00',
  })
  price: string;

  @ApiProperty({
    type: String,
    description: 'Discount in Naira (formatted to 2 decimal places)',
    example: '500.00',
  })
  discount: string;

  @ApiProperty({ type: [String], format: 'date-time' })
  validityDates: Date[];

  @ApiProperty()
  capacity: number;

  @ApiProperty({ type: Date, format: 'date-time' })
  saleStartsAt: Date;

  @ApiProperty({ type: Date, format: 'date-time' })
  saleEndsAt: Date;

  @ApiProperty({ type: Date, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: TicketCreatorDto })
  creator: TicketCreatorDto;
}

export class CreateTicketResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({
    format: 'date-time',
  })
  eventDates: Date[];

  @ApiProperty({
    type: String,
    description: 'Price in Naira (formatted to 2 decimal places)',
    example: '10000.00',
  })
  price: string;

  @ApiProperty({
    type: String,
    description: 'Discount in Naira (formatted to 2 decimal places)',
    example: '500.00',
  })
  discount: string;

  @ApiProperty({
    format: 'date-time',
  })
  validityDates: Date[];

  @ApiProperty()
  capacity: number;

  @ApiProperty()
  saleStartsAt: Date;

  @ApiProperty()
  saleEndsAt: Date;

  @ApiProperty()
  createdAt: Date;
}
