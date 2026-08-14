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

export interface IAdminResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
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
