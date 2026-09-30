import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { OrderedTicketDto } from './order.dto';

export class GroupPayerDto {
  @ApiProperty({
    description: 'Full name of the person paying for the group',
    example: 'Ada Obi',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @Transform(({ value }) =>
    value && typeof value == 'string' ? value?.trim() : '',
  )
  fullName!: string;

  @ApiProperty({
    description: 'Used as the payment customer email on the payment gateway',
    example: 'ada@example.com',
  })
  @Transform(({ value }) =>
    value && typeof value == 'string' ? value?.trim() : '',
  )
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: '08012345678' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;
}

export class GroupMemberDto {
  @ApiProperty({
    description: 'Full name of a member the ticket is issued to',
    example: 'Tunde Bello',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @Transform(({ value }) =>
    value && typeof value == 'string' ? value?.trim() : '',
  )
  fullName!: string;

  @ApiProperty({
    description: 'Receives the ticket for this member',
    example: 'tunde@example.com',
  })
  @Transform(({ value }) =>
    value && typeof value == 'string' ? value?.trim() : '',
  )
  @IsEmail()
  email!: string;
}

export class GroupDto {
  @ApiProperty({ type: GroupPayerDto })
  @ValidateNested()
  @Type(() => GroupPayerDto)
  payer!: GroupPayerDto;

  @ApiProperty({
    type: [GroupMemberDto],
    minItems: 2,
    description: 'Members the tickets are issued to.',
  })
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => GroupMemberDto)
  members!: GroupMemberDto[];
}

export class CreateGroupBuyOrderDto {
  @ApiProperty({ type: GroupDto })
  @ValidateNested()
  @Type(() => GroupDto)
  group!: GroupDto;

  @ApiProperty({
    description: 'Slug of the ticket to purchase',
    example: 'google-devfest-2026',
  })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiPropertyOptional({ example: 'GDG-A7K2P9' })
  @IsOptional()
  @IsString()
  discountCode?: string;
}

export class CreateGroupBuyOrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  reference: string;

  @ApiProperty({ enum: ['AWAITING_PAYMENT'] })
  status: string;

  @ApiProperty({
    type: String,
    description: 'Total amount payable in Naira (2 decimal places)',
    example: '28500.00',
  })
  amount: string;

  @ApiProperty({
    type: String,
    description: '7.5% VAT plus payment gateway service charge',
    example: '2300.00',
  })
  vatAndCharges: string;

  @ApiProperty()
  currency: string;

  @ApiProperty({ type: Date, format: 'date-time' })
  expiresAt: Date;

  @ApiProperty({ type: OrderedTicketDto })
  ticket: OrderedTicketDto;
}
