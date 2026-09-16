import { redirect } from 'next/navigation';

export default function GiftTicketRedirect({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const params = new URLSearchParams();
  params.set('gift', 'true');

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (key === 'gift') continue;
      if (typeof value === 'string') {
        params.set(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      }
    }
  }

  redirect(`/tickets/buy?${params.toString()}`);
}
