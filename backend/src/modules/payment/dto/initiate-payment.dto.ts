import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiatePaymentDto {
  @ApiProperty({
    description:
      'Unique identifier of the event for which the payment is being made',
    example: 'evt_1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({
    description: 'Unique identifier of the attendee making the payment',
    example: 'att_1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  attendeeId: string;

  @ApiProperty({
    description: 'Unique identifier of the registration linked to this payment',
    example: 'reg_1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  registrationId: string;

  @ApiProperty({
    description: 'Email address of the attendee making the payment',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Amount to be paid in the smallest currency unit (e.g., Naira kobo)',
    example: 5000,
  })
  @IsNumber()
  @IsPositive()
  amount: number;
}
