import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermission } from '../../../common/decorators/permissions.decorator';
import { ServiceError } from '../../../common/errors/service-error';
import { AuditLogService } from './audit-log.service';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';
import {
  AuditLogDetailResponseDto,
  PaginatedAuditLogResponseDto,
} from './dto/audit-log-response.dto';

@ApiTags('Audit Log')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @RequirePermission('audit-logs.view-list')
  @ApiOperation({ summary: 'List audit logs (filterable, paginated)' })
  @ApiOkResponse({ type: PaginatedAuditLogResponseDto })
  async findAll(
    @Query() query: AuditLogQueryDto,
  ): Promise<PaginatedAuditLogResponseDto> {
    return this.auditLogService.findAll(query);
  }

  // Powers a filter dropdown of valid action names in the UI, so the "Action"
  @Get('actions')
  @RequirePermission('audit-logs.view-list')
  @ApiOperation({
    summary: 'List distinct action names present in the audit log',
  })
  @ApiOkResponse({ type: [String] })
  async findDistinctActions(): Promise<string[]> {
    return this.auditLogService.findDistinctActions();
  }

  @Get(':id')
  @RequirePermission('audit-logs.view')
  @ApiOperation({
    summary:
      'Get full detail (including metadata) for a single audit log entry',
  })
  @ApiOkResponse({ type: AuditLogDetailResponseDto })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Audit log not found',
  })
  async findOne(@Param('id') id: string): Promise<AuditLogDetailResponseDto> {
    try {
      return await this.auditLogService.findOne(id);
    } catch (err) {
      if (
        err instanceof ServiceError &&
        err.name === AuditLogService.ERRORS.NotFoundErr
      ) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
      throw err;
    }
  }
}
