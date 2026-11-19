-- CreateTable
CREATE TABLE "app_settings" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updated_by_id" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("key")
);

-- Give the existing SUPERADMIN role the new payment gateway permissions
-- (the seed only runs when no superadmin exists yet).
UPDATE "roles"
SET "permissions" = ARRAY(
  SELECT DISTINCT unnest("permissions" || ARRAY['payment_gateway.view', 'payment_gateway.manage'])
)
WHERE "name" = 'SUPERADMIN';
