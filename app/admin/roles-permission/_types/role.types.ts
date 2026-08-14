export type RoleStatus = 'Active' | 'Deactivated';

export interface Permission {
  id: string;
  label: string;
}

export interface RoleRecord {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // permission ids
  status: RoleStatus;
  dateCreated: string;
  declarationDate?: string;
}

export interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
}
