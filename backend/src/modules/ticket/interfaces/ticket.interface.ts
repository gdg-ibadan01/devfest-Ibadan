import { TicketStatus } from '@prisma/client';

export interface ITicket {
  id: string;
  ticketNumber: string;
  eventId: string;
  registrationId: string;
  qrCode: string;
  status: TicketStatus;
  issuedAt: Date;
  validFrom: Date;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;

  event?: {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
  };

  registration?: {
    status: string;
    isCheckedIn: boolean;
    checkInTime?: Date | null;
    attendee?: {
      id: string;
      email: string;
      fullName: string;
      phoneNumber?: string | null;
      company?: string | null;
      jobTitle?: string | null;
    };
  };
}

export interface ITicketVerification {
  isValid: boolean;
  ticket?: ITicket;
  message: string;
}
