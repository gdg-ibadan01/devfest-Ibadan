import { IPaystackResponse } from '../../payment/interfaces/payment.interface';
import { Role } from '@prisma/client';

export interface IAttendee {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  amount?: number;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateAttendee {
  attendee: IAttendee;
  payment?: IPaystackResponse;
  paymentUrl?: string;
}
