import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  UseGuards,
  HttpStatus,
  Param,
  Patch,
  BadRequestException,
  HttpCode,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateRoleDto,
  CreateRoleResponseDto,
  GetRoleResponseDto,
  ListRolesResponseDto,
  ListPermissionsResponse,
} from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IJwtPayload } from './interfaces/admin.interface';
import { RoleResponseDto } from './dto/role.dto';

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
  async create(
    @Body() payload: CreateRoleDto,
    @CurrentUser() user: IJwtPayload,
  ) {
    try {
      return await this.roleService.create(payload, user.sub);
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

  @Patch(':id')
  @ApiBearerAuth()
  @RequirePermission('roles.edit')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOkResponse({
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiOperation({ summary: 'Update a role' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateRoleDto,
    @CurrentUser() user: IJwtPayload,
  ) {
    try {
      return await this.roleService.update(id, payload, user.sub);
    } catch (err) {
      switch ((err as Error).name) {
        case RolesService.ERRORS.DuplicateRoleErr:
          throw new ConflictException((err as Error).message);

        case RolesService.ERRORS.RoleNotFoundErr:
          throw new NotFoundException((err as Error).message);

        default:
          throw new InternalServerErrorException('Unable to update role');
      }
    }
  }

  @Patch(':id/deactivate')
  @ApiBearerAuth()
  @RequirePermission('roles.deactivate')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOkResponse({
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiOperation({ summary: 'Deactivate a role' })
  @HttpCode(HttpStatus.OK)
  async deactivate(@Param('id') id: string, @CurrentUser() user: IJwtPayload) {
    try {
      return await this.roleService.deactivate(id, user.sub);
    } catch (err) {
      switch ((err as Error).name) {
        case RolesService.ERRORS.RoleNotFoundErr:
          throw new NotFoundException((err as Error).message);

        case RolesService.ERRORS.AlreadyDeactivatedErr:
          throw new BadRequestException((err as Error).message);

        default:
          throw new InternalServerErrorException('Unable to deactivate role');
      }
    }
  }

  @Get(':roleId')
  @ApiBearerAuth()
  @RequirePermission('roles.list')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiOkResponse({ type: GetRoleResponseDto })
  async getById(@Param('roleId') roleId: string) {
    return await this.roleService.getById(roleId);
  }
}
