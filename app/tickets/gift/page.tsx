import { redirect } from 'next/navigation';

export default function GiftTicketRedirect() {
  redirect('/tickets/buy');
}
