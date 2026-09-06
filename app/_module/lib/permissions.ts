import type { PermissionId } from '@/app/_module/api/types';

/**
 * Returns true if `granted` contains at least one of the permission IDs in
 * `required`. An empty/undefined `required` list means "no permission
 * needed" (always visible).
 */
export function hasAnyPermission(
  granted: PermissionId[] | undefined,
  required: PermissionId[] | undefined
): boolean {
  if (!required || required.length === 0) return true;
  if (!granted) return false;
  return required.some((perm) => granted.includes(perm));
}
