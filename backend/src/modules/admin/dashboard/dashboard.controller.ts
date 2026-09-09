import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import {
  AttendeeListQueryDto,
  AttendeeListResponseDto,
  DashboardOverviewResponseDto,
} from './dto/dashboard-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RequirePermission } from 'src/common/decorators/permissions.decorator';
import { PermissionsGuard } from '../guards/permissions.guard';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @ApiBearerAuth()
  @RequirePermission('dashboard.view')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({
    summary:
      'Home screen: stats, registration trend, ticket breakdown, recent attendees',
  })
  @ApiOkResponse({ type: DashboardOverviewResponseDto })
  async overview() {
    return this.dashboardService.overview();
  }

  @Get('attendees')
  @ApiBearerAuth()
  @RequirePermission('dashboard.view')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({
    summary:
      'Attendees screen: filterable paginated registrations list with live summary cards',
    description: [
      'Returns four live summary counts (total, checkedIn, pending, cancelled) ',
      'plus a cursor-paginated table of registrations.',
      '',
      '**status** filter accepts:',
      '- `ALL` — all statuses (default)',
      '- `CHECKED_IN` — paid orders with at least one check-in',
      '- `REGISTERED` — paid orders that have not yet checked in',
      '- `PENDING` / `AWAITING_PAYMENT` — orders awaiting payment',
      '- `CANCELLED` — cancelled orders',
      '- `REFUNDED` / `AWAITING_REFUND` — refunded orders',
    ].join('\n'),
  })
  @ApiOkResponse({ type: AttendeeListResponseDto })
  async attendees(@Query() query: AttendeeListQueryDto) {
    return this.dashboardService.attendeeList(query);
  }
}
