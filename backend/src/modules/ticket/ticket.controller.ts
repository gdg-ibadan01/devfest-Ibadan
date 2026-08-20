import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TicketsService } from './ticket.service';
import { JwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import {
  CreateTicketDto,
  CreateTicketResponseDto,
  GetTicketBySlugResponseDto,
  GetTicketResponseDto,
  TicketListResponseDto,
  TicketQueryDto,
} from './dto/ticket.dto';
import { RolesGuard } from '../admin/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { RequirePermission } from 'src/common/decorators/permissions.decorator';
import { PermissionsGuard } from '../admin/guards/permissions.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { IJwtPayload } from '../admin/interfaces/admin.interface';

@ApiTags('Ticket')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiBearerAuth()
  @RequirePermission('tickets.create')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({ summary: 'Create a ticket' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateTicketResponseDto,
  })
  async create(
    @CurrentUser() user: IJwtPayload,
    @Body() payload: CreateTicketDto,
  ) {
    try {
      return await this.ticketsService.create(user, payload);
    } catch (err) {
      switch ((err as Error).name) {
        case TicketsService.ERRORS.ValidationErr:
          throw new BadRequestException((err as Error).message);
        default:
          throw new InternalServerErrorException((err as Error).message);
      }
    }
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List tickets' })
  @ApiResponse({
    status: 200,
    description: 'Tickets retrieved successfully',
    type: TicketListResponseDto,
  })
  findAll(@Query() query: TicketQueryDto) {
    return this.ticketsService.list(query);
  }

  // @Get('stats')
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  // @ApiOperation({ summary: 'Get ticket statistics' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Statistics retrieved successfully',
  // })
  // async getStats(@Query('eventId') eventId?: string) {
  //   return this.ticketsService.getTicketStats(eventId);
  // }

  @Get('verify/:ticketNumber')
  @ApiOperation({ summary: 'Verify ticket' })
  @ApiResponse({ status: 200, description: 'Ticket verification result' })
  verifyTicket(@Param('ticketNumber') ticketNumber: string) {
    return this.ticketsService.verifyTicket(ticketNumber);
  }

  @Post('checkin/:ticketNumber')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Check in attendee' })
  @ApiResponse({ status: 200, description: 'Check in successful' })
  checkIn(@Param('ticketNumber') ticketNumber: string) {
    return this.ticketsService.checkIn(ticketNumber);
  }

  @Post('cancel/:ticketNumber')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cancel ticket' })
  @ApiResponse({ status: 200, description: 'Ticket cancelled successfully' })
  cancelTicket(@Param('ticketNumber') ticketNumber: string) {
    return this.ticketsService.cancelTicket(ticketNumber);
  }

  // @Get('event/:eventId')
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  // @ApiOperation({ summary: 'Get tickets for event' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Event tickets retrieved successfully',
  // })
  // async getEventTickets(@Param('eventId') eventId: string) {
  //   return this.ticketsService.getEventTickets(eventId);
  // }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get ticket by slug' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ticket retrieved successfully',
    type: GetTicketBySlugResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ticket not found',
  })
  findBySlug(@Param('slug') slug: string) {
    return this.ticketsService.findBySlug(slug);
  }

  @Get(':ticketId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get ticket by ID' })
  @ApiResponse({
    status: 200,
    description: 'Ticket retrieved successfully',
    type: GetTicketResponseDto,
  })
  findOneById(@Param('ticketId') ticketId: string) {
    return this.ticketsService.findOneById(ticketId);
  }

  @Get('number/:ticketNumber')
  @ApiOperation({ summary: 'Get ticket by ticket number' })
  @ApiResponse({ status: 200, description: 'Ticket retrieved successfully' })
  findByTicketNumber(@Param('ticketNumber') ticketNumber: string) {
    return this.ticketsService.findByTicketNumber(ticketNumber);
  }
}
