import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/role.dto';
import { PrismaErrors } from 'src/common/enums/prisma-errors.enum';
import { ServiceError } from 'src/common/errors/service-error';
import { PERMISSION_ID, PERMISSIONS } from 'src/common/constants/permissions';

const permissionsMap = new Map<PERMISSION_ID, (typeof PERMISSIONS)[number]>();
PERMISSIONS.forEach((p) => {
  permissionsMap.set(p.id, p);
});

@Injectable()
export class RolesService {
  private logger = new Logger(RolesService.name);

  constructor(private prisma: PrismaService) {}

  static ERRORS = {
    DuplicateRoleErr: `DuplicateRoleErr`,
    AlreadyDeactivatedErr: 'AlreadyDeactivatedErr',
    RoleNotFoundErr: `RoleNotFoundErr`,
  } as const;

  async create(payload: CreateRoleDto) {
    try {
      const role = await this.prisma.role.create({
        data: {
          name: payload.name.toUpperCase(),
          description: payload.description,
          permissions: payload.permissions,
        },
      });

      return {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions.map((pId) =>
          permissionsMap.get(pId as PERMISSION_ID),
        ),
        isActive: role.isActive,
        createdAt: role.createdAt,
      };
    } catch (err) {
      this.logger.error(err);
      if (
        (err as { code: string }).code ==
        PrismaErrors.UNIQUE_CONSTRAINT_VIOLATION
      ) {
        throw new ServiceError(
          `${payload.name.toUpperCase()} role exists already`,
          RolesService.ERRORS.DuplicateRoleErr,
        );
      }
      throw new InternalServerErrorException({
        success: false,
        message: 'Unable to create role',
      });
    }
  }

  async list() {
    const roles = await this.prisma.role.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        permissions: true,
        isActive: true,
        createdAt: true,
      },
    });

    return {
      roles: roles.map((r) => ({
        ...r,
        permissions: r.permissions.map((pId) =>
          permissionsMap.get(pId as PERMISSION_ID),
        ),
      })),
    };
  }

  listPermissions() {
    return {
      permissions: [...PERMISSIONS].sort((pa, pb) =>
        pa.id.localeCompare(pb.id),
      ),
    };
  }

  // async update(id: string, payload: Partial<CreateRoleDto>, actorId: string) {
  //   const role = await this.prisma.role.findUnique({ where: { id } });
  //   if (!role) {
  //     throw new ServiceError('Role not found', 'NotFoundErr');
  //   }

  //   const updatedRole = await this.prisma.$transaction(async (tx) => {
  //     const updated = await tx.role.update({
  //       where: { id },
  //       data: {
  //         ...(payload.name !== undefined && {
  //           name: payload.name.trim().toUpperCase(),
  //         }),
  //         ...(payload.description !== undefined && {
  //           description: payload.description,
  //         }),
  //         ...(payload.permissions !== undefined && {
  //           permissions: payload.permissions,
  //         }),
  //         ...(payload.isActive !== undefined && {
  //           isActive: payload.isActive,
  //         }),
  //       },
  //     });
  //     await tx.auditLog.create({
  //       data: {
  //         adminId: actorId,
  //         roleId: id,
  //         action: 'UPDATE_ROLE',
  //         metadata: { payload },
  //       },
  //     });

  //     return updated;
  //   });

  //   return updatedRole;
  // }

  // async deactivate(id: string, actorId: string) {
  //   const role = await this.prisma.role.findUnique({ where: { id } });
  //   if (!role) {
  //     throw new ServiceError('Role not found', 'NotFoundErr');
  //   }

  //   if (!role.isActive) {
  //     throw new ServiceError('Role is already deactivated', 'AlreadyDeactivatedErr');
  //   }

  //   await this.prisma.$transaction(async (tx) => {
  //     await tx.role.update({
  //       where: { id },
  //       data: { isActive: false },
  //     });

  //     await tx.auditLog.create({
  //       data: {
  //         adminId: actorId,
  //         roleId: id,
  //         action: 'DEACTIVATE_ROLE',
  //       },
  //     });
  //   });

  //   return { message: 'Role deactivated successfully' };
  // }
}
