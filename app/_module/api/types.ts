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
export type CreateTicketDto = Omit<
  Schemas['CreateTicketDto'],
  'seatsPerUnit'
> & {
  seatsPerUnit?: number;
};
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

// ---- Payment gateway ---------------------------------------
export type PaymentGatewayStatus = Schemas['PaymentGatewayStatusDto'];
export type PaymentGatewayName = Schemas['SetPaymentGatewayDto']['provider'];

// ---- Orders: duplicate-order conflict (409) ----------------
export type OrderConflictResponseDto = Schemas['OrderConflictResponseDto'];

// ---- Checkout (hand-written: provider-specific popup config) -------------
export type PaymentProviderName = 'ALATPAY' | 'MONNIFY';

/** Server-built inline checkout. Pass `config` to the provider popup as-is. */
export interface PaymentSession {
  provider: PaymentProviderName;
  mode: 'INLINE';
  reference: string;
  amount: number;
  currency: string;
  config: Record<string, unknown>;
}

export interface CheckoutSessionResponse {
  reference: string;
  status:
    'AWAITING_PAYMENT' | 'PAID' | 'CANCELLED' | 'AWAITING_REFUND' | 'REFUNDED';
  provider: PaymentProviderName;
  amount: string;
  currency: string;
  expiresAt: string;
  ticket: { name: string };
  payment: PaymentSession | null;
}

export interface VerifyCheckoutDto {
  reference: string;
  /** Omit when the popup returned no transaction id (ALATPay cards). */
  transactionRef?: string;
}

export interface VerifyCheckoutResponse {
  status: CheckoutSessionResponse['status'];
  outcome: string;
}

// ---- Orders ------------------------------------------------
export type CreateOrderDto = Schemas['CreateOrderDto'] & {
  discountCode?: string;
};
export type CreateOrderResponseDto = Omit<
  Schemas['CreateOrderResponseDto'],
  'payment'
> & {
  checkoutUrl?: string | null;
  payment?: PaymentSession | null;
};
export type CreateGroupBuyOrderDto = Schemas['CreateGroupBuyOrderDto'];
export type CreateGroupBuyOrderResponseDto = Omit<
  Schemas['CreateGroupBuyOrderResponseDto'],
  'payment'
> & {
  payment?: PaymentSession | null;
};
export type GroupDto = Schemas['GroupDto'];
export type GroupPayerDto = Schemas['GroupPayerDto'];
export type GroupMemberDto = Schemas['GroupMemberDto'];
export type OrderAttendeeDto = Schemas['OrderAttendeeDto'];
export type OrderGifterDto = Schemas['OrderGifterDto'];
export type OrderedTicketDto = Schemas['OrderedTicketDto'];
export type OrderListItemDto = Schemas['OrderListItemDto'];
export type OrdersPaginationMetaDto = Schemas['OrdersPaginationMetaDto'];
export type OrderListResponseDto = Schemas['OrderListResponseDto'];
export type GetOrderReferenceResponseDto = Omit<
  Schemas['GetOrderReferenceResponseDto'],
  'ticket'
> & {
  /** url is null until the order is PAID. */
  ticket: { name: string; validityDates: string[]; url: string | null };
  expiresAt?: string;
};
export type AdminCreateOrderDto = Schemas['AdminCreateOrderDto'];

// ---- Dashboard -----------------------------------------------
export type DashboardStatsDto = Schemas['DashboardStatsDto'];
export type RegistrationTrendPointDto = Schemas['RegistrationTrendPointDto'];
export type TicketBreakdownSliceDto = Schemas['TicketBreakdownSliceDto'];
export type RecentAttendeeDto = Schemas['RecentAttendeeDto'];
export type DashboardOverviewResponseDto =
  Schemas['DashboardOverviewResponseDto'];

// ---- Discounts -------------------------------------------------
// The generated schema describes `limit` as an object because the upstream
// OpenAPI document marks a nullable numeric field with `type: object`.
// Keep the API's actual contract explicit for callers.
export type CreateDiscountDto = Schemas['CreateDiscountDto'];
export type UpdateDiscountDto = Schemas['UpdateDiscountDto'];
export type CreateDiscountResponseDto = Schemas['CreateDiscountResponseDto'];
export type DiscountListTicketDto = Schemas['DiscountListTicketDto'];
export type DiscountListItemDto = Schemas['DiscountListItemDto'];
export type DiscountPaginationMetaDto = Schemas['DiscountPaginationMetaDto'];
export type DiscountListResponseDto = Schemas['DiscountListResponseDto'];

// ---- Audit Log ---------------------------------------------------
export type AuditLogAdminDto = Schemas['AuditLogAdminDto'];
export type AuditLogRoleDto = Schemas['AuditLogRoleDto'];
export type AuditLogResponseDto = Schemas['AuditLogResponseDto'];
export type PaginationMetaDto = Schemas['PaginationMetaDto'];
export type PaginatedAuditLogResponseDto =
  Schemas['PaginatedAuditLogResponseDto'];
export type AuditLogDetailResponseDto = Schemas['AuditLogDetailResponseDto'];

// ---- Discounts ---------------------------------------------
export interface DiscountByCodeResponseDto {
  amount: string;
  isActive: boolean;
}

// ---- Query param helpers -----------------------------------
export interface OrderListParams {
  search?: string;
  status?:
    'AWAITING_PAYMENT' | 'PAID' | 'CANCELLED' | 'AWAITING_REFUND' | 'REFUNDED';
  /** ISO 8601 instant; only orders created at or after it. */
  dateFrom?: string;
  /** ISO 8601 instant; only orders created at or before it. */
  dateTo?: string;
  direction?: 'next' | 'previous';
  cursor?: string;
  limit?: number;
}

export type OrderExportParams = Pick<
  OrderListParams,
  'search' | 'status' | 'dateFrom' | 'dateTo'
> & { format?: 'csv' | 'pdf' };

export interface OrderExportResponseDto {
  data: OrderListItemDto[];
  total: number;
  /** True when more orders matched than the export limit. */
  truncated: boolean;
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

export interface DiscountListParams {
  name?: string;
  direction?: 'next' | 'previous';
  cursor?: string;
  limit?: number;
}

export interface AuditLogListParams {
  page?: number;
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

export interface CheckedInListParams {
  eventDates: string[];
  direction?: 'next' | 'previous';
  cursor?: string;
  limit?: number;
}

export interface OrderListParams {
  search?: string;
  status?:
    'AWAITING_PAYMENT' | 'PAID' | 'CANCELLED' | 'AWAITING_REFUND' | 'REFUNDED';
}

// ---- Emails (hand-written until `yarn gen:api` picks up the new endpoints) --
export type EmailSendStatus = 'PENDING' | 'SENT' | 'FAILED';
export type EmailCampaignStatus =
  | 'DRAFT'
  | 'SENDING'
  | 'SENT'
  | 'PARTIAL'
  | 'FAILED';

export interface CampaignAudience {
  ticketId?: string;
  /** true = only checked-in, false = only not checked-in, undefined = everyone */
  checkedIn?: boolean;
  ticketEmailNotConfirmed?: boolean;
}

export interface CampaignStats {
  total: number;
  sent: number;
  failed: number;
  pending: number;
}

export interface EmailCampaignDto {
  id: string;
  subject: string;
  preheader: string;
  body: string;
  audience: CampaignAudience;
  status: EmailCampaignStatus;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdByName?: string;
  stats: CampaignStats;
}

export interface SaveEmailCampaignDto {
  subject: string;
  preheader?: string;
  body: string;
  audience?: CampaignAudience;
}

/** What the mail provider reported after accepting a message. */
export type EmailEventState = 'DELIVERED' | 'DELAYED' | 'BOUNCED' | 'COMPLAINED';

export interface EmailDeliveryDto {
  id: string;
  email: string;
  fullName: string;
  status: EmailSendStatus;
  error: string | null;
  attempts: number;
  sentAt: string | null;
  event: EmailEventState | null;
  eventDetail: string | null;
}

export interface EmailDeliveriesResponse {
  data: EmailDeliveryDto[];
  total: number;
  page: number;
  limit: number;
}

export interface TicketEmailSummary {
  sent: number;
  failed: number;
  pending: number;
  unknown: number;
  unconfirmed: number;
}

export interface ResendBulkResult {
  attempted: number;
  sent: number;
  failed: number;
  /** Set when the mail limit was reached part-way; the rest go out automatically later. */
  deferred: number;
  remaining: number;
  budgetLeft: number | null;
}
