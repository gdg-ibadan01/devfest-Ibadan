import { Body, Controller, Post } from '@nestjs/common';
import { CreateRoleDto } from './dto/role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}
  @Post()
  // TODO:
  // - RBAC
  async create(@Body() payload: CreateRoleDto) {
    return await this.roleService.create(payload);
  }
}
