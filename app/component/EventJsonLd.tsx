import { ticketTiers } from '@/app/_module/data/secure-your-tickets.data';
import {
  DEFAULT_DESCRIPTION,
  OG_IMAGE,
  ORGANIZER,
  SITE_NAME,
  SITE_URL,
} from '@/app/_module/config/seo';

function priceToNumber(price: string) {
  const digits = price.replace(/[^\d.]/g, '');
  return digits ? Number(digits) : null;
}

/** Event + Organization structured data for the landing page (server-rendered). */
export default function EventJsonLd() {
  const offers = ticketTiers
    .filter((tier) => tier.isActive)
    .flatMap((tier) => {
      const price = priceToNumber(tier.price);
      if (price === null) return [];
      return [
        {
          '@type': 'Offer',
          name: tier.name,
          price,
          priceCurrency: 'NGN',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/tickets/buy`,
        },
      ];
    });

  const graph = [
    {
      '@type': 'Event',
      '@id': `${SITE_URL}/#event`,
      name: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      url: SITE_URL,
      image: [OG_IMAGE.url],
      startDate: '2026-11-21',
      endDate: '2026-11-21',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: 'Kakanfo Inn & Conference Centre',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Ring Road',
          addressLocality: 'Ibadan',
          addressRegion: 'Oyo',
          addressCountry: 'NG',
        },
      },
      organizer: { '@id': `${SITE_URL}/#organizer` },
      ...(offers.length ? { offers } : {}),
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organizer`,
      name: ORGANIZER.name,
      url: ORGANIZER.url,
      sameAs: ORGANIZER.sameAs,
    },
  ];

  // "<" is escaped so the JSON can never close the script tag early.
  const json = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph,
  }).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
