import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AttendeeService } from './attendee.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { RegisterEventDto } from './dto/register-event.dto';

@ApiTags('attendees')
@Controller('attendees')
export class AttendeeController {
  constructor(private readonly attendeeService: AttendeeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new attendee' })
  @ApiResponse({ status: 201, description: 'Attendee created successfully' })
  async create(@Body() createAttendeeDto: CreateAttendeeDto) {
    return this.attendeeService.create(createAttendeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendees' })
  @ApiResponse({ status: 200, description: 'Attendees retrieved successfully' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.attendeeService.findAll(page, limit);
  }

  @Get(':id/retrieve')
  @ApiOperation({ summary: 'Get attendee by ID' })
  @ApiResponse({ status: 200, description: 'Attendee retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.attendeeService.findOne(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get attendee by email' })
  @ApiResponse({ status: 200, description: 'Attendee retrieved successfully' })
  async findByEmail(@Param('email') email: string) {
    return this.attendeeService.findByEmail(email);
  }

  @Post(':id/register')
  @ApiOperation({ summary: 'Register attendee for event' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  async registerForEvent(
    @Param('id') attendeeId: string,
    @Body() registerEventDto: RegisterEventDto,
  ) {
    return this.attendeeService.registerForEvent(attendeeId, registerEventDto);
  }

  @Get(':id/registrations')
  @ApiOperation({ summary: 'Get attendee registrations' })
  @ApiResponse({
    status: 200,
    description: 'Registrations retrieved successfully',
  })
  async getRegistrations(@Param('id') attendeeId: string) {
    return this.attendeeService.getRegistrations(attendeeId);
  }
}
