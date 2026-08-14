import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/role.dto';
import { PERMISSIONS } from 'src/common/constants/permissions';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(payload: CreateRoleDto) {
    return await this.prisma.role.create({
      data: {
        name: payload.name,
        description: payload.description,
        permissions: payload.permissions,
      },
    });
  }

  list() {
    return {
      roles: [...PERMISSIONS].sort((pa, pb) => pa.id.localeCompare(pb.id)),
    };
  }
}
