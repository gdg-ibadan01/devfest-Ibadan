-- SetDefault existing null limits to 0 (unlimited)
UPDATE "discounts" SET "limit" = 0 WHERE "limit" IS NULL;

-- AlterTable: make limit non-nullable with default
ALTER TABLE "discounts" ALTER COLUMN "limit" SET NOT NULL;
ALTER TABLE "discounts" ALTER COLUMN "limit" SET DEFAULT 0;

-- AlterTable: add validTo
ALTER TABLE "discounts" ADD COLUMN "valid_to" TIMESTAMPTZ(6);