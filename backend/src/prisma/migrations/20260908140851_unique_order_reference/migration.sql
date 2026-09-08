-- DropIndex
DROP INDEX "orders_reference_provider_transaction_ref_key";

-- CreateIndex
CREATE UNIQUE INDEX "orders_reference_key" ON "orders"("reference");