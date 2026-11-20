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
    const metadata = this.reflector.getAllAndOverride<
      PERMISSION_ID | PERMISSION_ID[] | undefined
    >(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    const required = (
      Array.isArray(metadata) ? metadata : metadata ? [metadata] : []
    ).filter(Boolean);
    if (required.length === 0) return true;

    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: IJwtPayload }>();
    if (!user?.roleId) throw this.forbidden();

    const role = await this.prisma.role.findUnique({
      where: { id: user.roleId },
      select: { permissions: true },
    });

    const granted = (role?.permissions ?? []) as PERMISSION_ID[];
    if (!required.some((permission) => granted.includes(permission))) {
      throw this.forbidden();
    }

    return true;
  }

  private forbidden() {
    return new ForbiddenException({ message: 'Forbidden', success: false });
  }
}
