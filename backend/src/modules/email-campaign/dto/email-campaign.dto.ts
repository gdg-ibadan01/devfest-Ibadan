import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class CampaignAudienceDto {
  @ApiPropertyOptional({ description: 'Only holders of this ticket type' })
  @IsOptional()
  @IsUUID()
  ticketId?: string;

  @ApiPropertyOptional({
    description: 'true = only checked-in, false = only not checked-in',
  })
  @IsOptional()
  @IsBoolean()
  checkedIn?: boolean;

  @ApiPropertyOptional({
    description:
      'Only holders whose ticket confirmation email is not confirmed sent',
  })
  @IsOptional()
  @IsBoolean()
  ticketEmailNotConfirmed?: boolean;
}

export class CreateEmailCampaignDto {
  @ApiProperty({ example: 'Venue and schedule update' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  subject!: string;

  @ApiPropertyOptional({ description: 'Inbox preview text' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  preheader?: string;

  @ApiProperty({
    description:
      'Plain text / light markdown. Tokens: {{first_name}}, {{full_name}}, {{ticket_code}}, {{ticket_link}}',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20000)
  body!: string;

  @ApiPropertyOptional({ type: CampaignAudienceDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CampaignAudienceDto)
  audience?: CampaignAudienceDto;
}

export class UpdateEmailCampaignDto extends PartialType(
  CreateEmailCampaignDto,
) {}

export const MAX_TEST_RECIPIENTS = 10;

export class SendTestEmailDto {
  @ApiPropertyOptional({
    type: [String],
    description: `Addresses to send the test to (max ${MAX_TEST_RECIPIENTS}). Defaults to your own address.`,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(MAX_TEST_RECIPIENTS)
  @IsEmail({}, { each: true })
  emails?: string[];
}

export class AudienceCountDto {
  @ApiPropertyOptional({ type: CampaignAudienceDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CampaignAudienceDto)
  audience?: CampaignAudienceDto;
}

export class DeliveriesQueryDto {
  @ApiPropertyOptional({ enum: ['PENDING', 'SENT', 'FAILED'] })
  @IsOptional()
  @IsIn(['PENDING', 'SENT', 'FAILED'])
  status?: 'PENDING' | 'SENT' | 'FAILED';

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
