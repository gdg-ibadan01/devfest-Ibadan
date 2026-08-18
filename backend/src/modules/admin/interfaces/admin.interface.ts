import { type PERMISSION_ID } from 'src/common/constants/permissions';

export interface IAdmin {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Typed role object: makes it explicit that a role is driven by permissions. */
export interface IAdminRole {
  name: string;
  permissions: PERMISSION_ID[];
}

/** Full admin response — role is an object, not a plain string,
 *  so consumers immediately see that authorisation is permission-based. */
export interface IAdminResponse {
  id: string;
  fullName: string;
  email: string;
  /** The admin's assigned role, including the permissions it grants. */
  role: IAdminRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJwtPayload {
  sub: string;
  email: string;
  role: {
    name: string;
    permissions: PERMISSION_ID[];
  };
  iat?: number;
  exp?: number;
}

export interface IDashboardStats {
  totalEvents: number;
  totalAttendees: number;
  totalRegistrations: number;
  totalRevenue: number;
  upcomingEvents: number;
  ongoingEvents: number;
  completedEvents: number;
  recentRegistrations: any[];
  eventStats: any[];
}

export interface IUpdateProfileResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  updatedAt: Date;
}
