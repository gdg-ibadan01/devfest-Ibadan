import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiExtension } from '@nestjs/swagger';
import { type PERMISSION_ID } from '../constants/permissions';

export const PERMISSION_KEY = 'permission';

/**
 * Require at least ONE of the given permissions (any-of).
 *
 * `@RequirePermission('orders.list')` — single permission.
 * `@RequirePermission('orders.list', 'attendees.check_in')` — either grants access.
 *
 * Also stamps the operation in the OpenAPI doc with
 * `x-required-permissions`, so /api/docs always reflects the real guard.
 */
export const RequirePermission = (...permissions: PERMISSION_ID[]) =>
  applyDecorators(
    SetMetadata(PERMISSION_KEY, permissions),
    ApiExtension('x-required-permissions', { anyOf: permissions }),
  );
