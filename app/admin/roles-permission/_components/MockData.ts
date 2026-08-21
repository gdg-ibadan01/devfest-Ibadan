'use client'

import type { RoleRecord } from "../_types/role.types";


export const ALL_PERMISSIONS_SAMPLE = [
  'Create Tickets',
  'Assign permissions to Users',
  'Export Payment Reports',
  'Delete Tickets',
  'Edit Tickets',
  'Manage all User Roles',
  'View Payment Reports',
  'Manage Referral',
  'Check in Attendees',
  'View Full Attendee List',
];


const MOCK_ROLES: RoleRecord[] = [
  {
    id: '1',
    name: 'Super Admin',
    description:
      'The Super Admin role has complete access and control across the entire organisation.',
    permissions: ALL_PERMISSIONS_SAMPLE,
    status: 'Active',
    dateCreated: '15th March, 2025, 10:24',
    declarationDate: 'Friday, Saturday',
  },
  {
    id: '2',
    name: 'Admin',
    description: 'Admin role with standard management permissions.',
    permissions: ALL_PERMISSIONS_SAMPLE.slice(0, 7),
    status: 'Active',
    dateCreated: '15th March, 2025, 10:24',
    declarationDate: 'Friday',
  },
  {
    id: '3',
    name: 'Volunteer',
    description: 'Volunteer role with limited access.',
    permissions: ['Check in Attendees', 'View Full Attendee List'],
    status: 'Deactivated',
    dateCreated: '15th March, 2025, 10:24',
    declarationDate: 'Saturday',
  },
  {
    id: '4',
    name: 'Volunteer',
    description: 'Volunteer role with limited access.',
    permissions: ['Check in Attendees', 'View Full Attendee List'],
    status: 'Deactivated',
    dateCreated: '15th March, 2025, 10:24',
    declarationDate: 'Saturday',
  },
  {
    id: '5',
    name: 'Volunteer',
    description: 'Volunteer role with limited access.',
    permissions: ['Check in Attendees', 'View Full Attendee List'],
    status: 'Active',
    dateCreated: '15th March, 2025, 10:24',
    declarationDate: 'Friday',
  },
];

export default MOCK_ROLES;