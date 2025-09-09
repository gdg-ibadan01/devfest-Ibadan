import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TicketStatus } from '../../../common/enums/ticket-status.enum';

export class TicketQueryDto {
  @ApiPropertyOptional({
    description: 'The unique ID of the event to filter tickets for',
    example: 'evt_1234567890abcdef',
  })
  @IsOptional()
  @IsString()
  eventId?: string;

  @ApiPropertyOptional({
    description: 'Filter tickets by their current status',
    enum: TicketStatus,
    example: TicketStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiPropertyOptional({
    description:
      'A keyword to search across ticket fields such as attendee name or email',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of results to return per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  limit?: number = 10;
}
