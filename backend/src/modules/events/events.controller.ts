import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventQueryDto } from './dto/event-query.dto';
import { UpdateEventStatusDto } from './dto/update-status.dto';
import { RolesGuard } from '../admin/guards/roles.guard';
import { JwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { EventStatus } from '../../common/enums/event-status.enum';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  async create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200, description: 'Events retrieved successfully' })
  async findAll(@Query() query: EventQueryDto) {
    return this.eventsService.findAll(query);
  }

  @Get('published')
  @ApiOperation({ summary: 'Get all published events' })
  @ApiResponse({
    status: 200,
    description: 'Published events retrieved successfully',
  })
  async findPublished(@Query() query: EventQueryDto) {
    query.status = EventStatus.PUBLISHED;
    return this.eventsService.findAll(query);
  }

  @Get(':id/retrieve')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({ status: 200, description: 'Event retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get event by slug' })
  @ApiResponse({ status: 200, description: 'Event retrieved successfully' })
  async findBySlug(@Param('slug') slug: string) {
    return this.eventsService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update event' })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update event status' })
  @ApiResponse({
    status: 200,
    description: 'Event status updated successfully',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateEventStatusDto: UpdateEventStatusDto,
  ) {
    return this.eventsService.updateStatus(id, updateEventStatusDto.status);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete event' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
