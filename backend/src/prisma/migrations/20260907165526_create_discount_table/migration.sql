-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('SINGLE', 'BULK');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "created_by_id" TEXT;

-- CreateTable
CREATE TABLE "discounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DiscountType" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "ticket_slugs" TEXT[],
    "limit" INTEGER,
    "valid_from" TIMESTAMP(3) NOT NULL,
    "for_first_timers_only" BOOLEAN NOT NULL DEFAULT false,
    "recipient_emails" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
