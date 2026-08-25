import {
  Controller,
  Get,
  Post,
  Patch,
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
  OnSaleTicketQueryDto,
  OnSaleTicketResponseDto,
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

  @Patch(':ticketId')
  @ApiBearerAuth()
  @RequirePermission('tickets.create')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({ summary: 'Update a ticket' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateTicketResponseDto,
  })
  async update(
    @Param('ticketId') ticketId: string,
    @Body() payload: CreateTicketDto,
  ) {
    try {
      return await this.ticketsService.update(ticketId, payload);
    } catch (err) {
      switch ((err as Error).name) {
        case TicketsService.ERRORS.ValidationErr:
          throw new BadRequestException((err as Error).message);
        case 'NotFoundException':
          throw err;
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

  @Get('onsale')
  @ApiOperation({ summary: 'Get tickets currently on sale' })
  @ApiResponse({
    status: 200,
    description: 'Tickets retrieved successfully',
    type: OnSaleTicketResponseDto,
  })
  async findOnSale(@Query() query: OnSaleTicketQueryDto) {
    return this.ticketsService.findOnSale(query.name);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a ticket by slug' })
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
  @ApiOperation({ summary: 'Get a ticket by ID' })
  @ApiResponse({
    status: 200,
    description: 'Ticket retrieved successfully',
    type: GetTicketResponseDto,
  })
  findOneById(@Param('ticketId') ticketId: string) {
    return this.ticketsService.findOneById(ticketId);
  }
}
