export const PERMISSIONS = [
  { id: 'tickets.create', label: 'Create tickets' },
  { id: 'tickets.edit', label: 'Edit tickets' },
  { id: 'tickets.disable', label: 'Disable tickets' },
  { id: 'attendees.check_in', label: 'Check-in attendees' },
  { id: 'attendees.list', label: 'View attendee list' },
  { id: 'admins.create', label: 'Create admin' },
  { id: 'roles.create', label: 'Create role' },
  { id: 'roles.edit', label: 'Edit role' },
  { id: 'roles.assign', label: 'Assign role' },
  { id: 'roles.list', label: 'View roles list' },
  { id: 'permissions.assign', label: 'Assign permissions' },
  { id: 'payment_reports.export', label: 'Export payment report' },
] as const;

export type PERMISSION_ID = (typeof PERMISSIONS)[number]['id'];
