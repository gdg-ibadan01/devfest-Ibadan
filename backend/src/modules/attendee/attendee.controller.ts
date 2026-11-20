import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AttendeeService } from './attendee.service';
import {
  CheckInOrderDto,
  CheckInResponseDto,
  ScanCheckInDto,
  UndoCheckInResponseDto,
} from './dto/check-in.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { IJwtPayload } from '../admin/interfaces/admin.interface';
import { CheckedInQueryDto } from './dto/checked-in.dto';
import { CheckedInListResponseDto } from './dto/checked-in-response.dto';
import {
  CheckInStatsQueryDto,
  CheckInStatsResponseDto,
} from './dto/check-in-stats.dto';
import { JwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import { PermissionsGuard } from '../admin/guards/permissions.guard';
import { RequirePermission } from 'src/common/decorators/permissions.decorator';

@ApiTags('Attendee')
@Controller('attendees')
export class AttendeeController {
  constructor(private readonly attendeeService: AttendeeService) {}

  @Get('check-in/stats')
  @ApiBearerAuth()
  @RequirePermission('attendees.check_in', 'attendees.list', 'dashboard.view')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({
    summary: 'Check-in statistics for an event day',
    description:
      'Expected vs checked-in counts for one day (default: today in the venue timezone), broken down by ticket and by hour. ' +
      'Requires any of: attendees.check_in, attendees.list, dashboard.view.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Check-in stats retrieved successfully',
    type: CheckInStatsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Missing permission',
  })
  checkInStats(@Query() query: CheckInStatsQueryDto) {
    return this.attendeeService.checkInStats(query);
  }

  @Get('checked-in')
  @ApiBearerAuth()
  @RequirePermission('attendees.list', 'attendees.check_in')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({
    summary: 'List checked-in attendees',
    description:
      'Cursor-paginated list of attendees checked in on any of `eventDates` (venue timezone). By default returns earlier-created attendees first. ' +
      'Requires any of: attendees.list, attendees.check_in.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Checked-in orders retrieved successfully',
    type: CheckedInListResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Missing attendees.list / attendees.check_in permission',
  })
  checkedIn(@Query() query: CheckedInQueryDto) {
    return this.attendeeService.checkedIn(query);
  }

  @Patch('check-in')
  @ApiBearerAuth()
  @RequirePermission('attendees.check_in')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({
    summary: 'Check in an attendee',
    description:
      'Idempotent per day: checking in an attendee who already checked in today returns 200 with `alreadyCheckedIn: true` and does not add another entry. ' +
      '"Today" is the calendar day in the venue timezone (EVENT_TIMEZONE, default Africa/Lagos).',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attendee checked in (or was already checked in today)',
    type: CheckInResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ticket not valid for today, or order is not paid',
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
  async checkIn(
    @Body() dto: CheckInOrderDto,
    @CurrentUser() user: IJwtPayload,
  ) {
    try {
      return await this.attendeeService.checkIn(dto, user.sub);
    } catch (err) {
      throw toHttp(err);
    }
  }

  @Post('check-in/scan')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @RequirePermission('attendees.check_in')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({
    summary: 'Check in from a scanned ticket QR or typed ticket code',
    description:
      'Accepts the content of the QR printed on every ticket (the signed ticket download URL, or just its token) and verifies the signature, so tickets emailed before this endpoint existed work. ' +
      'Also accepts the 6-character ticket code or full reference. Same response and per-day idempotency as PATCH /attendees/check-in.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attendee checked in (or was already checked in today)',
    type: CheckInResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'QR signature invalid, ticket not valid today, or order not paid',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No such ticket' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Typed code matches more than one ticket',
  })
  async scan(@Body() dto: ScanCheckInDto, @CurrentUser() user: IJwtPayload) {
    try {
      return await this.attendeeService.scanCheckIn(dto.code, user.sub);
    } catch (err) {
      throw toHttp(err);
    }
  }

  @Post('check-in/undo')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @RequirePermission('attendees.check_in')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({
    summary: "Undo today's check-in",
    description:
      'Removes the check-in(s) recorded today (venue timezone) for the order and writes an UNDO_CHECK_IN audit log entry. Check-ins on other days are kept.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Check-in removed',
    type: UndoCheckInResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Attendee is not checked in today',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No such ticket' })
  async undo(@Body() dto: CheckInOrderDto, @CurrentUser() user: IJwtPayload) {
    try {
      return await this.attendeeService.undoCheckIn(dto, user.sub);
    } catch (err) {
      throw toHttp(err);
    }
  }
}

function toHttp(err: unknown) {
  const { name, message } = err as Error;
  switch (name) {
    case AttendeeService.ERRORS.UnmatchedValidityDateErr:
    case AttendeeService.ERRORS.CheckInUnpaidOrderErr:
    case AttendeeService.ERRORS.InvalidTicketQrErr:
    case AttendeeService.ERRORS.NotCheckedInTodayErr:
      return new BadRequestException(message);
    case AttendeeService.ERRORS.TicketNotFoundErr:
      return new NotFoundException(message);
    case AttendeeService.ERRORS.AmbiguousTicketCodeErr:
      return new ConflictException(message);
    default:
      return new InternalServerErrorException(message);
  }
}
