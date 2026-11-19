-- CreateEnum
CREATE TYPE "EmailAssetKind" AS ENUM ('INLINE_IMAGE', 'ATTACHMENT');

-- CreateTable
CREATE TABLE "email_campaign_assets" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "kind" "EmailAssetKind" NOT NULL,
    "filename" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL DEFAULT 'raw',
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_campaign_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_campaign_assets_campaign_id_kind_idx" ON "email_campaign_assets"("campaign_id", "kind");

-- AddForeignKey
ALTER TABLE "email_campaign_assets" ADD CONSTRAINT "email_campaign_assets_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "email_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
