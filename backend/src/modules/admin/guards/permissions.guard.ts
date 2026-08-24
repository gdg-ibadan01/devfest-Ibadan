import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type PERMISSION_ID } from 'src/common/constants/permissions';
import { PERMISSION_KEY } from 'src/common/decorators/permissions.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { IJwtPayload } from '../interfaces/admin.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.getAllAndOverride<PERMISSION_ID>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!permission) return true;

    const { user } = context.switchToHttp().getRequest<{ user: IJwtPayload }>();
    const role = await this.prisma.role.findFirstOrThrow({
      where: { id: user.roleId },
    });

    if (!user || !(role.permissions as PERMISSION_ID[]).includes(permission)) {
      throw new ForbiddenException({
        message: 'Forbidden',
        success: false,
      });
    }

    return true;
  }
}
