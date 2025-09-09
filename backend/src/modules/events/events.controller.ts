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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventQueryDto } from './dto/event-query.dto';
import { UpdateEventStatusDto } from './dto/update-status.dto';
import { RolesGuard } from '../admin/guards/roles.guard';
import { JwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import { UploadService } from '../upload/upload.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { EventStatus } from '../../common/enums/event-status.enum';
import { query } from 'winston';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly uploadService: UploadService,
  ) {}

  // @Post()
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  // @ApiOperation({ summary: 'Create a new event' })
  // @ApiBody({ type: CreateEventDto })
  // @ApiResponse({ status: 201, description: 'Event created successfully' })
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('bannerImage'))
  // async create(
  //   @Body() createEventDto: CreateEventDto,
  //   @UploadedFile() file: Express.Multer.File,
  //   @Request() req,
  // ) {
  //   let bannerImageUrl: string | undefined;

  //   if (file) {
  //     const uploaded = await this.uploadService.uploadImage(file, 'events');
  //     bannerImageUrl = uploaded.url;
  //   }
  //   return this.eventsService.create(
  //     { ...createEventDto, bannerImage: bannerImageUrl },
  //     req.user.id,
  //   );
  // }

  // @Get()
  // @ApiOperation({ summary: 'Get all events' })
  // @ApiResponse({ status: 200, description: 'Events retrieved successfully' })
  // async findAll(@Query() query: any) {
  //   return this.eventsService.findAll(query);
  // }

  // @Get('published')
  // @ApiOperation({ summary: 'Get all published events' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Published events retrieved successfully',
  // })
  // async findPublished(@Query() query: Partial<EventQueryDto>) {
  //   return this.eventsService.findAll({
  //     ...query,
  //     status: EventStatus.PUBLISHED,
  //   });
  // }

  // @Get(':id/retrieve')
  // @ApiOperation({ summary: 'Get event by ID' })
  // @ApiResponse({ status: 200, description: 'Event retrieved successfully' })
  // async findOne(@Param('id') id: string) {
  //   return this.eventsService.findOne(id);
  // }

  // @Get('slug/:slug')
  // @ApiOperation({ summary: 'Get event by slug' })
  // @ApiResponse({ status: 200, description: 'Event retrieved successfully' })
  // async findBySlug(@Param('slug') slug: string) {
  //   return this.eventsService.findBySlug(slug);
  // }

  // @Patch(':id')
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  // @ApiOperation({ summary: 'Update event' })
  // @ApiResponse({ status: 200, description: 'Event updated successfully' })
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('bannerImage'))
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateEventDto: UpdateEventDto,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   let bannerImageUrl: string | undefined;

  //   // Handle uploaded banner image
  //   if (file) {
  //     const uploaded = await this.uploadService.uploadImage(file, 'events');
  //     bannerImageUrl = uploaded.url;
  //   }

  //   // Merge banner image URL into DTO if uploaded
  //   const dataToUpdate = {
  //     ...updateEventDto,
  //     ...(bannerImageUrl && { bannerImage: bannerImageUrl }),
  //   };

  //   return this.eventsService.update(id, dataToUpdate);
  // }

  // @Patch(':id/status')
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  // @ApiOperation({ summary: 'Update event status' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Event status updated successfully',
  // })
  // async updateStatus(
  //   @Param('id') id: string,
  //   @Body() updateEventStatusDto: UpdateEventStatusDto,
  // ) {
  //   return this.eventsService.updateStatus(id, updateEventStatusDto.status);
  // }

  //   @Delete(':id')
  //   @ApiBearerAuth()
  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  //   @ApiOperation({ summary: 'Delete event' })
  //   @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  //   async remove(@Param('id') id: string) {
  //     return this.eventsService.remove(id);
  //   }
}
