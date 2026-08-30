import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import { PermissionsGuard } from '../admin/guards/permissions.guard';
import { RequirePermission } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IJwtPayload } from '../admin/interfaces/admin.interface';
import { ServiceError } from '../../common/errors/service-error';
import { AttendeeService } from './attendee.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { AttendeeResponseDto } from './dto/attendee-response.dto';
import { OrdersService } from '../order/order.service';

@ApiTags('Attendees')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('attendees')
export class AttendeeController {
  constructor(private readonly attendeeService: AttendeeService) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('attendees.create')
  @ApiOperation({ summary: 'Manually add a new attendee by admin' })
  @ApiOkResponse({
    description: 'Attendee successfully created',
    type: AttendeeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Ticket slug not found' })
  @ApiResponse({
    status: 409,
    description:
      'Ticket sold out, reserved, or duplicate order for this attendee',
  })
  @ApiResponse({
    status: 502,
    description: 'Payment gateway could not be initialised',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateAttendeeDto,
    @CurrentUser() user: IJwtPayload,
  ) {
    try {
      return await this.attendeeService.create(dto, user.sub);
    } catch (err) {
      if (err instanceof HttpException) throw err;

      if (err instanceof ServiceError) {
        switch (err.name) {
          case OrdersService.ERRORS.ValidationErr:
          case OrdersService.ERRORS.NotOnSaleErr:
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);

          case OrdersService.ERRORS.SoldOutErr:
          case OrdersService.ERRORS.RetryLaterErr:
          case OrdersService.ERRORS.DuplicateErr:
            throw new HttpException(err.message, HttpStatus.CONFLICT);

          case OrdersService.ERRORS.PaymentErr:
            throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);

          default:
            throw new HttpException(
              err.message,
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
      }

      throw new HttpException(
        'Unable to add attendee',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
