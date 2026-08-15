import { IPaystackResponse } from '../../payment/interfaces/payment.interface';

export interface IAttendee {
  email: string;
  fullName: string;
  phoneNumber?: string;
  company?: string;
  jobTitle?: string;
  amount: number;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateResponse {
  attendee: IAttendee;
  payment: IPaystackResponse;
  paymentUrl: string;
}
