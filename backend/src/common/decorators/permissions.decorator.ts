import { SetMetadata } from '@nestjs/common';
import { type PERMISSION_ID } from '../constants/permissions';

export const PERMISSION_KEY = 'permission';
export const RequirePermission = (permission: PERMISSION_ID) =>
  SetMetadata(PERMISSION_KEY, permission);
