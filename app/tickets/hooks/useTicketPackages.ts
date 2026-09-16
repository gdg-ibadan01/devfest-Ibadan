'use client';

import { useState, useEffect, useMemo } from 'react';
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
      return {
        id: ticket.slug,
        title: ticket.name,
        badge: ticket.description || 'Access Pass',
        price,
        formattedPrice: `₦ ${price.toLocaleString('en-NG', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      };
    });
  }, [onSaleData]);

  // ── Auto-select package from URL parameter or default to first package ────
  useEffect(() => {
    if (packages.length > 0) {
      const packageParam =
        searchParams.get('package') ||
        searchParams.get('ticket') ||
        searchParams.get('slug');

      if (packageParam && packages.some((p) => p.id === packageParam)) {
        setSelectedPackageId(packageParam);
      } else if (
        !selectedPackageId ||
        !packages.some((p) => p.id === selectedPackageId)
      ) {
        setSelectedPackageId(packages[0].id);
      }
    }
  }, [packages, selectedPackageId, searchParams]);

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
