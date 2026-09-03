export const PERMISSIONS = [
  { id: 'tickets.create', label: 'Create tickets' },
  { id: 'tickets.edit', label: 'Edit tickets' },
  { id: 'tickets.disable', label: 'Disable tickets' },
  { id: 'attendees.check_in', label: 'Check-in attendees' },
  { id: 'attendees.list', label: 'View attendee list' },
  { id: 'admins.create', label: 'Create admin' },
  { id: 'admins.list', label: 'View admin list' },
  { id: 'admins.invite', label: 'Invite admin' },
  { id: 'admins.update', label: 'Update admin' },
  { id: 'admins.profile', label: 'View admin profile' },
  { id: 'admins.deactivate', label: 'Deactivate admin' },
  { id: 'roles.create', label: 'Create role' },
  { id: 'roles.edit', label: 'Edit role' },
  { id: 'roles.assign', label: 'Assign role' },
  { id: 'roles.list', label: 'View roles list' },
  { id: 'roles.deactivate', label: 'Deactivate role' },
  { id: 'permissions.assign', label: 'Assign permissions' },
  { id: 'payment_reports.export', label: 'Export payment report' },
  { id: 'orders.list', label: 'View orders list' },
] as const;

export type PERMISSION_ID = (typeof PERMISSIONS)[number]['id'];
