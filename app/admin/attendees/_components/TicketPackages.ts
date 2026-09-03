
import { TicketPackage } from "../_types/attendee.types";

export const TICKET_PACKAGES: TicketPackage[] = [
  { id: 'friday-workshop', days: 'Friday', type: 'Workshop', price: '₦ 4,000.00' },
  { id: 'saturday-main', days: 'Saturday', type: 'Main event & Workshop', price: '₦ 8,000.00' },
  { id: 'fri-sat-main-workshop', days: 'Friday & Saturday', type: 'Main event & Workshop', price: '₦ 8,000.00' },
  { id: 'fri-sat-main', days: 'Friday & Saturday', type: 'Main event', price: '₦ 8,000.00' },
];