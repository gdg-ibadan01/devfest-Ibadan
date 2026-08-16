import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
  Get,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  CreateRoleDto,
  CreateRoleResponseDto,
  ListPermissionsResponse,
} from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';
import {
  ApiBearerAuth,
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

  @Get('permissions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    type: ListPermissionsResponse,
  })
  list() {
    return this.roleService.listPermissions();
  }
}
