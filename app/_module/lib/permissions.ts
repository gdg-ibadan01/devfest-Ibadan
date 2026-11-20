import type { PermissionId } from '@/app/_module/api/types';
import { ADMIN_NAV } from '@/app/_module/config/adminNav';

/**
 * Returns true if `granted` contains at least one of the permission IDs in
 * `required`. An empty/undefined `required` list means "no permission
 * needed" (always visible).
 */
export function hasAnyPermission(
  granted: readonly PermissionId[] | undefined,
  required: readonly PermissionId[] | undefined
): boolean {
  if (!required || required.length === 0) return true;
  if (!granted) return false;
  return required.some((perm) => granted.includes(perm));
}

/** First admin page this permission set can open, or null if none. */
export function firstAllowedPath(
  granted: readonly PermissionId[] | undefined
): string | null {
  // Home first; then Checkins, so door staff land where they work.
  const preferred = ['/core/home', '/core/checkins'];
  const ordered = [
    ...ADMIN_NAV.filter((i) => preferred.includes(i.href)).sort(
      (a, b) => preferred.indexOf(a.href) - preferred.indexOf(b.href)
    ),
    ...ADMIN_NAV.filter((i) => !preferred.includes(i.href)),
  ];
  return (
    ordered.find((item) => hasAnyPermission(granted, item.permissions))?.href ??
    null
  );
}
