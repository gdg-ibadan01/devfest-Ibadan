import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class UpdateEventStatusDto {
  @ApiProperty({
    description: 'The new status of the event',
    enum: EventStatus,
    example: EventStatus.PUBLISHED,
  })
  @IsEnum(EventStatus)
  status: EventStatus;
}
