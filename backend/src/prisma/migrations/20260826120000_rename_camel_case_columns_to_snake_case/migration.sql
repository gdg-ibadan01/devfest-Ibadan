-- AlterTable: roles
ALTER TABLE "roles" RENAME COLUMN "isActive" TO "is_active";
ALTER TABLE "roles" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "roles" RENAME COLUMN "updatedAt" TO "updated_at";

-- AlterTable: admins
ALTER TABLE "admins" RENAME COLUMN "fullName" TO "full_name";
ALTER TABLE "admins" RENAME COLUMN "roleId" TO "role_id";
ALTER TABLE "admins" RENAME COLUMN "isActive" TO "is_active";
ALTER TABLE "admins" RENAME COLUMN "invitedById" TO "invited_by_id";
ALTER TABLE "admins" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "admins" RENAME COLUMN "updatedAt" TO "updated_at";

-- AlterTable: password_reset_tokens
ALTER TABLE "password_reset_tokens" RENAME COLUMN "adminId" TO "admin_id";
ALTER TABLE "password_reset_tokens" RENAME COLUMN "expiresAt" TO "expires_at";
ALTER TABLE "password_reset_tokens" RENAME COLUMN "usedAt" TO "used_at";
ALTER TABLE "password_reset_tokens" RENAME COLUMN "createdAt" TO "created_at";

-- AlterTable: audit_logs
ALTER TABLE "audit_logs" RENAME COLUMN "adminId" TO "admin_id";
ALTER TABLE "audit_logs" RENAME COLUMN "roleId" TO "role_id";
ALTER TABLE "audit_logs" RENAME COLUMN "createdAt" TO "created_at";

-- AlterTable: tickets
ALTER TABLE "tickets" RENAME COLUMN "eventDates" TO "event_dates";
ALTER TABLE "tickets" RENAME COLUMN "validityDates" TO "validity_dates";
ALTER TABLE "tickets" RENAME COLUMN "saleStartsAt" TO "sale_starts_at";
ALTER TABLE "tickets" RENAME COLUMN "saleEndsAt" TO "sale_ends_at";
ALTER TABLE "tickets" RENAME COLUMN "creatorId" TO "creator_id";
ALTER TABLE "tickets" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "tickets" RENAME COLUMN "updatedAt" TO "updated_at";

-- AlterTable: orders
ALTER TABLE "orders" RENAME COLUMN "ticketId" TO "ticket_id";
ALTER TABLE "orders" RENAME COLUMN "attendeeFullName" TO "attendee_full_name";
ALTER TABLE "orders" RENAME COLUMN "attendeeEmail" TO "attendee_email";
ALTER TABLE "orders" RENAME COLUMN "attendeePhoneNumber" TO "attendee_phone_number";
ALTER TABLE "orders" RENAME COLUMN "gifterName" TO "gifter_name";
ALTER TABLE "orders" RENAME COLUMN "gifterEmail" TO "gifter_email";
ALTER TABLE "orders" RENAME COLUMN "paymentProvider" TO "payment_provider";
ALTER TABLE "orders" RENAME COLUMN "providerTransactionRef" TO "provider_transaction_ref";
ALTER TABLE "orders" RENAME COLUMN "checkoutUrl" TO "checkout_url";
ALTER TABLE "orders" RENAME COLUMN "expiresAt" TO "expires_at";
ALTER TABLE "orders" RENAME COLUMN "paidAt" TO "paid_at";
ALTER TABLE "orders" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "orders" RENAME COLUMN "updatedAt" TO "updated_at";
