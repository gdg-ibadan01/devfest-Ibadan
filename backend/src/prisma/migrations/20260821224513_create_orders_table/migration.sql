-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('AWAITING_PAYMENT', 'PAID', 'CANCELLED', 'EXPIRED', 'AWAITING_REFUND', 'REFUNDED');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "attendeeFullName" TEXT NOT NULL,
    "attendeeEmail" TEXT NOT NULL,
    "attendeePhoneNumber" TEXT,
    "gifterName" TEXT,
    "gifterEmail" TEXT,
    "discount" DECIMAL(65,30) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "status" "OrderStatus" NOT NULL DEFAULT 'AWAITING_PAYMENT',
    "paymentProvider" TEXT NOT NULL DEFAULT 'MONNIFY',
    "providerTransactionRef" TEXT,
    "checkoutUrl" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_reference_key" ON "orders"("reference");

-- CreateIndex
CREATE INDEX "orders_ticketId_status_idx" ON "orders"("ticketId", "status");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
