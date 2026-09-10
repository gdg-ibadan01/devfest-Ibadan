-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "check_ins" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[];
