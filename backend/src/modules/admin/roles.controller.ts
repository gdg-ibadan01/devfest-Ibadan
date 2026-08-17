import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  CreateRoleDto,
  CreateRoleResponseDto,
  ListRolesResponseDto,
  ListPermissionsResponse,
} from './dto/role.dto';
import { RolesService } from './roles.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionsGuard } from './guards/permissions.guard';
import { RequirePermission } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('roles')
@ApiTags('Role')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Post()
  @ApiBearerAuth()
  @RequirePermission('roles.create')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({ summary: 'Create a role' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateRoleResponseDto,
  })
  async create(@Body() payload: CreateRoleDto) {
    try {
      return await this.roleService.create(payload);
    } catch (error) {
      switch ((error as Error).name) {
        case RolesService.ERRORS.DuplicateRoleErr:
          throw new ConflictException(error);

        default:
          throw new InternalServerErrorException('Unable to create role');
      }
    }
  }

  @Get()
  @ApiBearerAuth()
  @RequirePermission('roles.list')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({ summary: 'List roles' })
  @ApiResponse({ type: ListRolesResponseDto })
  async list() {
    return await this.roleService.list();
  }

  @Get('permissions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List permissions' })
  @ApiOkResponse({
    type: ListPermissionsResponse,
  })
  listPermssions() {
    return this.roleService.listPermissions();
  }
}
