import { IPaystackResponse } from '../../payment/interfaces/payment.interface';
import { Role } from '@prisma/client';

export interface IAttendee {
  email: string;
  fullName: string;
  phoneNumber?: string;
  company?: string;
  jobTitle?: string;
  amount: number;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateResponse {
  attendee: IAttendee;
  payment: IPaystackResponse;
  paymentUrl: string;
}
