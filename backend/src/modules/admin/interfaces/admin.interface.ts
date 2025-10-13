import { Role } from '@prisma/client';

export interface IAdmin {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminResponse {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoginResponse {
  admin: IAdminResponse;
  accessToken: string;
  refreshToken: string;
}

export interface IJwtPayload {
  sub: string;
  email: string;
  role: Role;
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
