import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AttendeeService } from './attendee.service';
import { CheckInOrderDto, CheckInResponseDto } from './dto/check-in.dto';
import { JwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import { PermissionsGuard } from '../admin/guards/permissions.guard';
import { RequirePermission } from 'src/common/decorators/permissions.decorator';

@ApiTags('Attendee')
@Controller('attendees')
export class AttendeeController {
  constructor(private readonly attendeeService: AttendeeService) {}

  @Patch('check-in')
  @ApiBearerAuth()
  @RequirePermission('attendees.check_in')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({ summary: 'Check in an attendee' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attendee checked in successfully',
    type: CheckInResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ticket not valid for today',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Missing attendees.check_in permission',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ticket not found',
  })
  async checkIn(@Body() dto: CheckInOrderDto) {
    try {
      return await this.attendeeService.checkIn(dto);
    } catch (err) {
      switch ((err as Error).name) {
        case AttendeeService.ERRORS.UnmatchedValidityDateErr:
        case AttendeeService.ERRORS.CheckInUnpaidOrderErr:
          throw new BadRequestException((err as Error).message);
        case AttendeeService.ERRORS.TicketNotFoundErr:
          throw new NotFoundException((err as Error).message);
        default:
          throw new InternalServerErrorException((err as Error).message);
      }
    }
  }
}
