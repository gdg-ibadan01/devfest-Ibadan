/*
  Warnings:

  - A unique constraint covering the columns `[provider,event_type,transaction_reference]` on the table `webhook_events` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_provider_event_type_transaction_reference_key" ON "webhook_events"("provider", "event_type", "transaction_reference");
