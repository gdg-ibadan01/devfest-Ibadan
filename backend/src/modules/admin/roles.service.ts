import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/role.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(payload: CreateRoleDto) {
    return {
      message: 'Role created successfully',
      role: payload,
    };
  }
}
