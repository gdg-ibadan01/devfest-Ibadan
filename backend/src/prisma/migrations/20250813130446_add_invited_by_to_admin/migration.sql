-- AlterTable
ALTER TABLE "public"."admins" ADD COLUMN     "invitedBy" TEXT;

-- AddForeignKey
ALTER TABLE "public"."admins" ADD CONSTRAINT "admins_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "public"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
