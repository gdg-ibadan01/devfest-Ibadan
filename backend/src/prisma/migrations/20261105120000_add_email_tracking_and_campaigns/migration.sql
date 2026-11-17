-- CreateEnum
CREATE TYPE "EmailSendStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "EmailCampaignStatus" AS ENUM ('DRAFT', 'SENDING', 'SENT', 'PARTIAL', 'FAILED');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "ticket_email_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ticket_email_error" TEXT,
ADD COLUMN     "ticket_email_sent_at" TIMESTAMP(3),
ADD COLUMN     "ticket_email_status" "EmailSendStatus";

-- CreateTable
CREATE TABLE "email_campaigns" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "preheader" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL,
    "audience" JSONB NOT NULL DEFAULT '{}',
    "status" "EmailCampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "created_by_id" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_deliveries" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "status" "EmailSendStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "message_id" TEXT,
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_campaigns_status_idx" ON "email_campaigns"("status");

-- CreateIndex
CREATE INDEX "email_deliveries_campaign_id_status_idx" ON "email_deliveries"("campaign_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "email_deliveries_campaign_id_email_key" ON "email_deliveries"("campaign_id", "email");

-- AddForeignKey
ALTER TABLE "email_campaigns" ADD CONSTRAINT "email_campaigns_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_deliveries" ADD CONSTRAINT "email_deliveries_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "email_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_deliveries" ADD CONSTRAINT "email_deliveries_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Grant the new email permissions to the existing SUPERADMIN role
-- (the seed only runs when no superadmin exists yet).
UPDATE "roles"
SET "permissions" = ARRAY(
  SELECT DISTINCT unnest("permissions" || ARRAY['emails.send', 'emails.manage'])
)
WHERE "name" = 'SUPERADMIN';
