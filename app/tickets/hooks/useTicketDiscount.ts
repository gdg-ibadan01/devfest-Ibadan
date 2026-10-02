import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { showToast } from '@/app/_module/lib/notify';
import {
  getDiscountByCode,
  type AppliedDiscount,
} from '@/app/_module/services/discount.service';

export function useTicketDiscount() {
  const searchParams = useSearchParams();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [isDiscountFromUrl, setIsDiscountFromUrl] = useState(false);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const hasAppliedDiscountFromUrl = useRef(false);

  const handleApplyDiscount = useCallback(
    async (codeToApply: string, fromUrl: boolean = false) => {
      const cleanCode = codeToApply.trim().toUpperCase();
      if (!cleanCode) return;

      setDiscountError('');
      setIsApplyingDiscount(true);
      if (fromUrl) {
        showToast.info(`Applying discount code from link: ${cleanCode}...`);
      }

      try {
        const data = await getDiscountByCode(cleanCode);

        if (!data.isActive) {
          const msg = 'This discount code is no longer active';
          setDiscountError(msg);
          showToast.error(msg);
          setAppliedDiscount(null);
          setIsDiscountFromUrl(false);
          return;
        }

        const amountNum = Number.parseFloat(data.amount) || 0;
        setAppliedDiscount({
          code: cleanCode,
          amount: amountNum,
        });
        setDiscountError('');
        setIsDiscountFromUrl(fromUrl);
        showToast.success(
          fromUrl
            ? `Discount code "${cleanCode}" from link applied successfully!`
            : 'Discount applied successfully'
        );
      } catch (err: any) {
        const msg =
          err?.message ||
          (err?.data && typeof err.data.message === 'string' ? err.data.message : null) ||
          'Discount not found';
        setDiscountError(msg);
        showToast.error(
          fromUrl
            ? `Discount from link "${cleanCode}" is invalid or expired: ${msg}`
            : msg
        );
        setAppliedDiscount(null);
        setIsDiscountFromUrl(false);
      } finally {
        setIsApplyingDiscount(false);
      }
    },
    []
  );

  const handleRemoveDiscount = useCallback(() => {
    setIsApplyingDiscount(false);
    setAppliedDiscount(null);
    setDiscountCode('');
    setDiscountError('');
    setIsDiscountFromUrl(false);
    showToast.info('Discount removed');
  }, []);

  const resetDiscount = useCallback(() => {
    setIsApplyingDiscount(false);
    setAppliedDiscount(null);
    setDiscountCode('');
    setDiscountError('');
    setIsDiscountFromUrl(false);
  }, []);

  // ── Extract and apply discount code from URL query parameters ──────────────
  useEffect(() => {
    if (hasAppliedDiscountFromUrl.current) return;

    const discountParam =
      searchParams.get('discount') ||
      searchParams.get('discountCode') ||
      searchParams.get('code') ||
      searchParams.get('discount_code') ||
      searchParams.get('coupon');

    if (discountParam) {
      hasAppliedDiscountFromUrl.current = true;
      const cleanCode = discountParam.trim().toUpperCase();
      setDiscountCode(cleanCode);
      setIsDiscountFromUrl(true);

      handleApplyDiscount(cleanCode, true);
    }
  }, [searchParams, handleApplyDiscount]);

  return {
    discountCode,
    setDiscountCode,
    appliedDiscount,
    setAppliedDiscount,
    discountError,
    setDiscountError,
    isDiscountFromUrl,
    isApplyingDiscount,
    handleApplyDiscount,
    handleRemoveDiscount,
    resetDiscount,
  };
}

