import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterEventDto {
  @ApiProperty({
    description:
      'Unique identifier of the event the user wants to register for',
    example: '23aehg5666f8a2b74c2f9a0b',
  })
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ApiPropertyOptional({
    description:
      'Any special request the participant may have (e.g., wheelchair access, front row seating)',
    example:
      'Please provide wheelchair access and reserved seating near the stage',
  })
  @IsOptional()
  @IsString()
  specialRequests?: string;

  @ApiPropertyOptional({
    description: 'Participant’s dietary restrictions for catering purposes',
    example: 'Vegetarian, Gluten-Free',
  })
  @IsOptional()
  @IsString()
  dietaryRestrictions?: string;
}
