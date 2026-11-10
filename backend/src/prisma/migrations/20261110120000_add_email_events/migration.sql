-- CreateEnum
CREATE TYPE "EmailEventState" AS ENUM ('DELIVERED', 'DELAYED', 'BOUNCED', 'COMPLAINED');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "ticket_email_message_id" TEXT,
ADD COLUMN     "ticket_email_event" "EmailEventState",
ADD COLUMN     "ticket_email_event_at" TIMESTAMP(3),
ADD COLUMN     "ticket_email_event_detail" TEXT;

-- AlterTable
ALTER TABLE "email_deliveries" ADD COLUMN     "event" "EmailEventState",
ADD COLUMN     "event_at" TIMESTAMP(3),
ADD COLUMN     "event_detail" TEXT;

-- CreateIndex
CREATE INDEX "orders_ticket_email_message_id_idx" ON "orders"("ticket_email_message_id");

-- CreateIndex
CREATE INDEX "email_deliveries_message_id_idx" ON "email_deliveries"("message_id");
