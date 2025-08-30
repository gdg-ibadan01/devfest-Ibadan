import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TicketsService } from './ticket.service';
import { JwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import { TicketQueryDto } from './dto/ticket-query.dto';
import { RolesGuard } from '../admin/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all tickets' })
  @ApiResponse({ status: 200, description: 'Tickets retrieved successfully' })
  async findAll(@Query() query: TicketQueryDto) {
    return this.ticketsService.findAll(query);
  }

  @Get('stats')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get ticket statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStats(@Query('eventId') eventId?: string) {
    return this.ticketsService.getTicketStats(eventId);
  }

  @Get('verify/:ticketNumber')
  @ApiOperation({ summary: 'Verify ticket' })
  @ApiResponse({ status: 200, description: 'Ticket verification result' })
  async verifyTicket(@Param('ticketNumber') ticketNumber: string) {
    return this.ticketsService.verifyTicket(ticketNumber);
  }

  @Post('checkin/:ticketNumber')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Check in attendee' })
  @ApiResponse({ status: 200, description: 'Check in successful' })
  async checkIn(@Param('ticketNumber') ticketNumber: string) {
    return this.ticketsService.checkIn(ticketNumber);
  }

  @Post('cancel/:ticketNumber')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cancel ticket' })
  @ApiResponse({ status: 200, description: 'Ticket cancelled successfully' })
  async cancelTicket(@Param('ticketNumber') ticketNumber: string) {
    return this.ticketsService.cancelTicket(ticketNumber);
  }

  @Get('event/:eventId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get tickets for event' })
  @ApiResponse({
    status: 200,
    description: 'Event tickets retrieved successfully',
  })
  async getEventTickets(@Param('eventId') eventId: string) {
    return this.ticketsService.getEventTickets(eventId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get ticket by ID' })
  @ApiResponse({ status: 200, description: 'Ticket retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Get('number/:ticketNumber')
  @ApiOperation({ summary: 'Get ticket by ticket number' })
  @ApiResponse({ status: 200, description: 'Ticket retrieved successfully' })
  async findByTicketNumber(@Param('ticketNumber') ticketNumber: string) {
    return this.ticketsService.findByTicketNumber(ticketNumber);
  }
}
