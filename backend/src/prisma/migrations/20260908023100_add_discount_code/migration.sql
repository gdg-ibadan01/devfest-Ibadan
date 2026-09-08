-- AlterTable
ALTER TABLE "discounts" ADD COLUMN "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "discounts_code_key" ON "discounts"("code");