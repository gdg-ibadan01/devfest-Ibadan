-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'SUPER_ADMIN', 'ATTENDEE');

-- CreateEnum
CREATE TYPE "public"."TicketStatus" AS ENUM ('ACTIVE', 'USED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "public"."admins" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "invitedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."attendees" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "company" TEXT,
    "jobTitle" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'ATTENDEE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tickets" (
    "id" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "status" "public"."TicketStatus" NOT NULL DEFAULT 'ACTIVE',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "ticketType" TEXT NOT NULL,
    "isCheckedIn" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "attendeeId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" TEXT NOT NULL,
    "attendeeId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "paystackReference" TEXT,
    "paymentReference" TEXT NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "paidAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "public"."admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "attendees_email_key" ON "public"."attendees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_ticketNumber_key" ON "public"."tickets"("ticketNumber");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_qrCode_key" ON "public"."tickets"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "payments_paystackReference_key" ON "public"."payments"("paystackReference");

-- CreateIndex
CREATE UNIQUE INDEX "payments_paymentReference_key" ON "public"."payments"("paymentReference");

-- AddForeignKey
ALTER TABLE "public"."admins" ADD CONSTRAINT "admins_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "public"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tickets" ADD CONSTRAINT "tickets_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "public"."attendees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tickets" ADD CONSTRAINT "tickets_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "public"."attendees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
