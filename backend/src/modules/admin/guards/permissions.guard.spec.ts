import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from './permissions.guard';

function ctx(user: unknown) {
  return {
    getHandler: () => null,
    getClass: () => null,
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as never;
}

function guard(required: unknown, granted: string[] | null) {
  const reflector = {
    getAllAndOverride: () => required,
  } as unknown as Reflector;
  const prisma = {
    role: {
      findUnique: jest
        .fn()
        .mockResolvedValue(granted ? { permissions: granted } : null),
    },
  };
  return new PermissionsGuard(reflector, prisma as never);
}

describe('PermissionsGuard', () => {
  const user = { sub: 'a1', roleId: 'r1' };

  it('passes when no permission is required', async () => {
    await expect(guard(undefined, []).canActivate(ctx(user))).resolves.toBe(
      true,
    );
  });

  it('passes when the role has any one of the required permissions', async () => {
    const g = guard(
      ['orders.list', 'attendees.check_in'],
      ['attendees.check_in'],
    );
    await expect(g.canActivate(ctx(user))).resolves.toBe(true);
  });

  it('still accepts legacy single-string metadata', async () => {
    const g = guard('attendees.check_in', ['attendees.check_in']);
    await expect(g.canActivate(ctx(user))).resolves.toBe(true);
  });

  it('forbids when none match', async () => {
    const g = guard(['orders.list'], ['attendees.check_in']);
    await expect(g.canActivate(ctx(user))).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('forbids (not 500) when the role no longer exists', async () => {
    const g = guard(['orders.list'], null);
    await expect(g.canActivate(ctx(user))).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
