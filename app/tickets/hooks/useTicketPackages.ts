'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTicketsOnSale } from '@/app/_module/services';
import type { TicketPackage } from '../components';

export function useTicketPackages() {
  const searchParams = useSearchParams();
  const [selectedPackageId, setSelectedPackageId] = useState('');

  const {
    data: onSaleData,
    isLoading: isLoadingTickets,
    isRefetching: isRefetchingTickets,
    refetch: refetchTickets,
  } = useTicketsOnSale();

  const packages: TicketPackage[] = useMemo(() => {
    // return (onSaleData?.data || []).map((ticket) => {
    return [
      {
        name: 'Early Bird',
        description: '',
        slug: 'devfest-ibadan-early-bird-2026',
        validityDates: ['2026-11-21T00:00:00.000Z'],
        eventDates: ['2026-11-21T00:00:00.000Z'],
        price: '5000.00',
      },
      {
        name: 'Group Ticket',
        description: '',
        slug: 'devfest-ibadan-group-ticket-2026',
        validityDates: ['2026-11-21T00:00:00.000Z'],
        eventDates: ['2026-11-21T00:00:00.000Z'],
        price: '5000.00',
      },
      {
        name: 'Late Ticket',
        description: '',
        slug: 'devfest-ibadan-late-ticket-2026',
        validityDates: ['2026-11-21T00:00:00.000Z'],
        eventDates: ['2026-11-21T00:00:00.000Z'],
        price: '6000.00',
      },
    ].map((ticket) => {
      const price = Number.parseFloat(ticket.price) || 0;
      return {
        id: ticket.slug,
        title: ticket.name,
        badge: ticket.description || 'Access Pass',
        price,
        formattedPrice: ticket.slug.includes('group')
          ? `₦ ${price.toLocaleString('en-NG', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} / person`
          : `₦ ${price.toLocaleString('en-NG', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
      };
    });
  }, [onSaleData]);

  const packageParam =
    searchParams.get('package') ||
    searchParams.get('ticket') ||
    searchParams.get('slug');
  const appliedPackageParam = useRef<string | null | undefined>(undefined);

  // Apply a URL choice once, then preserve valid manual selections.
  useEffect(() => {
    if (!packages.length) return;
    const urlChanged = appliedPackageParam.current !== packageParam;
    appliedPackageParam.current = packageParam;
    setSelectedPackageId((currentId) => {
      if (
        urlChanged &&
        packageParam &&
        packages.some((p) => p.id === packageParam)
      ) {
        return packageParam;
      }
      return packages.some((p) => p.id === currentId)
        ? currentId
        : packages[0].id;
    });
  }, [packages, packageParam]);

  const selectedPackage = useMemo(() => {
    return packages.find((p) => p.id === selectedPackageId) || packages[0];
  }, [packages, selectedPackageId]);

  return {
    packages,
    selectedPackageId,
    setSelectedPackageId,
    selectedPackage,
    isLoadingTickets,
    isRefetchingTickets,
    refetchTickets,
  };
}
