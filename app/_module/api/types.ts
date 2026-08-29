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

// ---- Attendees ---------------------------------------------
export type CreateAttendeeDto = Schemas['CreateAttendeeDto'];
export type AttendeeDto = Schemas['AttendeeDto'];
export type AttendeePaginationMetaDto = Schemas['AttendeePaginationMetaDto'];
export type AttendeeListResponseDto = Schemas['AttendeeListResponseDto'];

// ---- Payments ----------------------------------------------
export type InitiatePaymentDto = Schemas['InitiatePaymentDto'];
export type VerifyPaymentDto = Schemas['VerifyPaymentDto'];

// ---- Orders ------------------------------------------------
export type CreateOrderDto = Schemas['CreateOrderDto'];
export type CreateOrderResponseDto = Schemas['CreateOrderResponseDto'];

// ---- Query param helpers -----------------------------------
export interface AttendeeListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  date?: string;
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
