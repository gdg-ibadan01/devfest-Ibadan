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
  } as const;

  /** @throws DuplicateRoleErr */
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
    // TODO we should probably use a cursor here but it doesn't look like we'll
    // have lots of roles for now
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
}
