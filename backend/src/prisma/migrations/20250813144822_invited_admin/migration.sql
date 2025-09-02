/*
  Warnings:

  - You are about to drop the column `invitedBy` on the `admins` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."admins" DROP CONSTRAINT "admins_invitedBy_fkey";

-- AlterTable
ALTER TABLE "public"."admins" DROP COLUMN "invitedBy",
ADD COLUMN     "invitedById" TEXT;

-- AddForeignKey
ALTER TABLE "public"."admins" ADD CONSTRAINT "admins_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "public"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
