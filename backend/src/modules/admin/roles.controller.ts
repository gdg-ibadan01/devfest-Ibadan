import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateRoleDto, ListRolesResponseDto } from './dto/role.dto';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}
  @Post()
  // TODO:
  // - RBAC
  async create(@Body() payload: CreateRoleDto) {
    return await this.roleService.create(payload);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    type: ListRolesResponseDto,
  })
  list() {
    return this.roleService.list();
  }
}
