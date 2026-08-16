import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { type PERMISSION_ID } from 'src/common/constants/permissions';
import { PERMISSION_KEY } from 'src/common/decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permission = this.reflector.getAllAndOverride<PERMISSION_ID>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!permission) return true;

    const { user } = context.switchToHttp().getRequest();
    if (
      !user ||
      !(user.role.permissions as PERMISSION_ID[]).includes(permission)
    ) {
      throw new ForbiddenException({
        message: 'Forbidden',
        success: false,
      });
    }

    return true;
  }
}
