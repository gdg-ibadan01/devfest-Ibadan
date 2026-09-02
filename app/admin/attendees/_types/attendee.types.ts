export type AttendeeStatus = 'Successful' | 'Failed' | 'Pending';

export interface AttendeeRecord {
  id: string;
  ticketId: string;
  date: string;
  fullName: string;
  email: string;
  code: string;
  eventDays: string;
  amount: string;
  status: AttendeeStatus;
}

export interface AddAttendeeForm {
  fullName: string;
  email: string;
  ticketPackage: string;
}

export interface TicketPackage {
  id: string;
  days: string;
  type: string;
  price: string;
}
