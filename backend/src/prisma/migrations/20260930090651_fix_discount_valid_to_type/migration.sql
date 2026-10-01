-- AlterTable
-- The conversion runs only where valid_to is still timestamptz.
-- USING pins the stored instant to UTC, so the value never moves.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'discounts'
          AND column_name = 'valid_to'
          AND data_type = 'timestamp with time zone'
    ) THEN
        ALTER TABLE "discounts"
            ALTER COLUMN "valid_to" SET DATA TYPE timestamp(3)
            USING "valid_to" AT TIME ZONE 'UTC';
    END IF;
END $$;
