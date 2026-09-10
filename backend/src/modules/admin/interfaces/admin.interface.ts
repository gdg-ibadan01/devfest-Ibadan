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

export interface IAdminRole {
  id: string;
  name: string;
}

export interface IAdminInvitedBy {
  id: string;
  name: string;
}

export interface IAdminResponse {
  id: string;
  fullName: string;
  email: string;
  role: IAdminRole;
  isActive: boolean;
  invitedBy: IAdminInvitedBy | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJwtPayload {
  sub: string;
  roleId: string;
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
