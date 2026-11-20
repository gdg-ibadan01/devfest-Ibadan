import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CheckInOrderDto {
  @ApiProperty({
    description: 'ID of the order being checked in',
    example: '0191a2b3-...',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  orderId!: string;
}

export class CheckInResponseDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty({
    description: 'Ticket code (last 6 characters of the reference)',
  })
  code: string;

  @ApiProperty()
  attendeeFullName: string;

  @ApiProperty()
  attendeeEmail: string;

  @ApiProperty({ example: 'Regular' })
  ticketName: string;

  @ApiProperty({
    description:
      'True when this attendee had already checked in today — the request is a no-op. Show a warning so a shared ticket is caught at the door.',
  })
  alreadyCheckedIn: boolean;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description:
      "Time of today's check-in (the earlier one if alreadyCheckedIn)",
  })
  checkedInAt: Date;

  @ApiProperty({ type: [String], format: 'date-time' })
  checkIns: Date[];
}

export class ScanCheckInDto {
  @ApiProperty({
    description:
      'What the scanner read from the ticket QR (the signed download URL or its token), or a typed ticket code / reference',
    example: 'https://api.devfestibadan.com/api/v1/tickets/download?token=…',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  code!: string;
}

export class UndoCheckInResponseDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty({ description: 'Ticket code' })
  code: string;

  @ApiProperty()
  attendeeFullName: string;

  @ApiProperty({
    type: [String],
    format: 'date-time',
    description: 'Check-ins remaining after the undo (other days)',
  })
  checkIns: Date[];
}
