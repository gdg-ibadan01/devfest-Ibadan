import { EventStatus } from '@prisma/client';

export interface IEvent {
  id: string;
  title: string;
  description: string;
  slug: string;
  venue: string;
  address: string;
  startDate: Date;
  endDate: Date;
  registrationStart: Date;
  registrationEnd: Date;
  maxAttendees: number;
  currentAttendees: number;
  isPaid: boolean;
  price?: number | null;
  status: EventStatus;
  bannerImage?: string | null;
  tags: string[];
  requirements: string[];
  agenda?: any;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateEvent {
  title: string;
  description: string;
  venue: string;
  address: string;
  startDate: Date;
  endDate: Date;
  registrationStart: Date;
  registrationEnd: Date;
  maxAttendees: number;
  isPaid: boolean;
  price?: number;
  bannerImage?: string;
  tags?: string[];
  requirements?: string[];
  agenda?: any;
  createdById: string;
}
