import { IsNotEmpty, IsString } from 'class-validator';
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

  @ApiProperty({ description: 'Ticket code' })
  code: string;

  @ApiProperty({ type: [String], format: 'date-time' })
  checkIns: Date[];
}
