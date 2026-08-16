import { IPaystackResponse } from '../../payment/interfaces/payment.interface';

export interface IAttendee {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  amount?: number;
  role: 'ATTENDEE' | 'ADMIN';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateAttendee {
  attendee: IAttendee;
  payment?: IPaystackResponse;
  paymentUrl?: string;
  message?: string;
}
