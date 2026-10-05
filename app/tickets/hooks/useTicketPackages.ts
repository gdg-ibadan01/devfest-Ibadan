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
    return (onSaleData?.data || []).map((ticket) => {
      const price = Number.parseFloat(ticket.price) || 0;
      const seatsPerUnit = ticket.seatsPerUnit ?? 1;
      const isGroup = seatsPerUnit > 1 || ticket.slug.includes('group');
      return {
        id: ticket.slug,
        title: ticket.name,
        badge: ticket.description || 'Access Pass',
        price,
        seatsPerUnit,
        formattedPrice: isGroup
          ? `₦ ${price.toLocaleString('en-NG', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
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
