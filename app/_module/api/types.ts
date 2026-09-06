/**
 * Derived TypeScript types from the auto-generated OpenAPI schema.
 * Source of truth: app/_module/api/schema.d.ts (run `yarn gen:api` to refresh).
 */
import type { components } from './schema';

type Schemas = components['schemas'];

// ---- Auth --------------------------------------------------
export type LoginAdminDto = Schemas['LoginAdminDto'];
export type LoginResponseDto = Schemas['LoginResponseDto'];
export type Admin = Schemas['Admin'];
export type RefreshTokenDto = Schemas['RefreshTokenDto'];
export type ForgotPasswordDto = Schemas['ForgotPasswordDto'];
export type ResetPasswordDto = Schemas['ResetPasswordDto'];
export type UpdateProfileDto = Schemas['UpdateProfileDto'];
export type ChangePasswordDto = Schemas['ChangePasswordDto'];

// ---- Admin -------------------------------------------------
export type AdminRoleDto = Schemas['AdminRoleDto'];
export type FindOneAdminResponseDto = Schemas['FindOneAdminResponseDto'];
export type FindAllAdminsItemDto = Schemas['FindAllAdminsItemDto'];
export type FindAllAdminsMetaDto = Schemas['FindAllAdminsMetaDto'];
export type FindAllAdminsResponseDto = Schemas['FindAllAdminsResponseDto'];
export type InviteAdminDto = Schemas['InviteAdminDto'];
export type AdminActionResponseDto = Schemas['AdminActionResponseDto'];

// ---- Roles -------------------------------------------------
export type PermissionDto = Schemas['PermissionDto'];
export type PermissionId = PermissionDto['id'];
export type CreateRoleDto = Schemas['CreateRoleDto'];
export type UpdateRoleDto = Schemas['UpdateRoleDto'];
export type CreateRoleResponseDto = Schemas['CreateRoleResponseDto'];
export type ListRolesItemResponseDto = Schemas['ListRolesItemResponseDto'];
export type ListRolesResponseDto = Schemas['ListRolesResponseDto'];
export type ListPermissionsResponse = Schemas['ListPermissionsResponse'];
export type GetRoleResponseDto = Schemas['GetRoleResponseDto'];

// ---- Tickets -----------------------------------------------
export type CreateTicketDto = Schemas['CreateTicketDto'];
export type CreateTicketResponseDto = Schemas['CreateTicketResponseDto'];
export type TicketListItemDto = Schemas['TicketListItemDto'];
export type TicketPaginationMetaDto = Schemas['TicketPaginationMetaDto'];
export type TicketListResponseDto = Schemas['TicketListResponseDto'];
export type GetTicketResponseDto = Schemas['GetTicketResponseDto'];
export type OnSaleTicketItemDto = Schemas['OnSaleTicketItemDto'];
export type OnSaleTicketResponseDto = Schemas['OnSaleTicketResponseDto'];

// ---- Attendees (check-in only; listing moved to Orders) -----
export type CheckInOrderDto = Schemas['CheckInOrderDto'];
export type CheckInResponseDto = Schemas['CheckInResponseDto'];
export type CheckedInListItemDto = Schemas['CheckedInListItemDto'];
export type CheckedInPaginationMetaDto = Schemas['CheckedInPaginationMetaDto'];
export type CheckedInListResponseDto = Schemas['CheckedInListResponseDto'];

// ---- Payments ----------------------------------------------
export type InitiatePaymentDto = Schemas['InitiatePaymentDto'];
export type VerifyPaymentDto = Schemas['VerifyPaymentDto'];

// ---- Orders ------------------------------------------------
export type CreateOrderDto = Schemas['CreateOrderDto'];
export type CreateOrderResponseDto = Schemas['CreateOrderResponseDto'];
export type OrderAttendeeDto = Schemas['OrderAttendeeDto'];
export type OrderGifterDto = Schemas['OrderGifterDto'];
export type OrderedTicketDto = Schemas['OrderedTicketDto'];
export type OrderListItemDto = Schemas['OrderListItemDto'];
export type OrdersPaginationMetaDto = Schemas['OrdersPaginationMetaDto'];
export type OrderListResponseDto = Schemas['OrderListResponseDto'];
export type GetOrderReferenceResponseDto = Schemas['GetOrderReferenceResponseDto'];

// ---- Query param helpers -----------------------------------
export interface OrderListParams {
  search?: string;
  status?: 'AWAITING_PAYMENT' | 'PAID' | 'CANCELLED' | 'AWAITING_REFUND' | 'REFUNDED';
  direction?: 'next' | 'previous';
  cursor?: string;
  limit?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface AdminListParams extends PaginationParams {
  search?: string;
  role?: string;
  isActive?: boolean;
}

export interface TicketListParams {
  cursor?: string;
  direction?: 'next' | 'prev';
  limit?: number;
  name?: string;
}

// ---- Audit Logs --------------------------------------------
export interface AuditLogItemDto {
  id: string;
  adminId: string;
  roleId: string | null;
  action: string;
  metadata: Record<string, any> | null;
  createdAt: string;
  admin: {
    id: string;
    fullName: string;
    email: string;
    role?: {
      id: string;
      name: string;
    } | null;
  };
  role?: {
    id: string;
    name: string;
  } | null;
}

export interface AuditLogPaginationMetaDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CheckedInListParams {
  eventDates: string[];
  direction?: 'next' | 'previous';
  cursor?: string;
  limit?: number;
}

export interface AuditLogListResponseDto {
  success: boolean;
  message: string;
  data: AuditLogItemDto[];
  meta: AuditLogPaginationMetaDto;
}

export interface AuditLogListParams extends PaginationParams {
  search?: string;
  action?: string;
  adminId?: string;
  roleId?: string;
  startDate?: string;
  endDate?: string;
  sortOrder?: 'asc' | 'desc';
}

