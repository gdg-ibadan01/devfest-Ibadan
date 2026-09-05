/*
  Warnings:

  - A unique constraint covering the columns `[reference,provider_transaction_ref]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "orders_reference_key";

-- CreateIndex
CREATE UNIQUE INDEX "orders_reference_provider_transaction_ref_key" ON "orders"("reference", "provider_transaction_ref");

-- RenameForeignKey
ALTER TABLE "admins" RENAME CONSTRAINT "admins_invitedById_fkey" TO "admins_invited_by_id_fkey";

-- RenameForeignKey
ALTER TABLE "admins" RENAME CONSTRAINT "admins_roleId_fkey" TO "admins_role_id_fkey";

-- RenameForeignKey
ALTER TABLE "audit_logs" RENAME CONSTRAINT "audit_logs_adminId_fkey" TO "audit_logs_admin_id_fkey";

-- RenameForeignKey
ALTER TABLE "audit_logs" RENAME CONSTRAINT "audit_logs_roleId_fkey" TO "audit_logs_role_id_fkey";

-- RenameForeignKey
ALTER TABLE "orders" RENAME CONSTRAINT "orders_ticketId_fkey" TO "orders_ticket_id_fkey";

-- RenameForeignKey
ALTER TABLE "password_reset_tokens" RENAME CONSTRAINT "password_reset_tokens_adminId_fkey" TO "password_reset_tokens_admin_id_fkey";

-- RenameForeignKey
ALTER TABLE "tickets" RENAME CONSTRAINT "tickets_creatorId_fkey" TO "tickets_creator_id_fkey";

-- RenameIndex
ALTER INDEX "orders_ticketId_status_idx" RENAME TO "orders_ticket_id_status_idx";
