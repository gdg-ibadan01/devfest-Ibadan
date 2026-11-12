'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import { getCheckoutSession } from '@/app/_module/services/order.service';
import { showToast } from '@/app/_module/lib/notify';
import {
  confirmPayment,
  usePaymentLauncher,
} from '@/hooks/payments/usePaymentLauncher';

/**
 * Pay link for an existing order (admin-created orders on inline-only
 * gateways such as ALATPay link here). Opens the gateway the order was
 * created with, then hands off to the success page.
 */
export default function PayOrderPage() {
  const params = useParams<{ reference: string }>();
  const reference = decodeURIComponent(params?.reference ?? '');
  const router = useRouter();
  const { launch } = usePaymentLauncher();
  const [isOpening, setIsOpening] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['checkout', reference],
    queryFn: () => getCheckoutSession(reference),
    enabled: !!reference,
    retry: false,
    staleTime: 0,
  });

  const goToStatus = useCallback(() => {
    router.push(`/tickets/success?paymentReference=${encodeURIComponent(reference)}`);
  }, [router, reference]);

  // Nothing to pay (already paid, cancelled, refunded): show its status.
  useEffect(() => {
    if (data && !data.payment) goToStatus();
  }, [data, goToStatus]);

  const handlePay = useCallback(async () => {
    if (!data?.payment) return;
    setIsOpening(true);
    try {
      await launch(data.payment, {
        onOpened: () => setIsOpening(false),
        onSuccess: (transactionRef) => {
          setIsOpening(false);
          void confirmPayment(reference, transactionRef).finally(goToStatus);
        },
        onPending: () => {
          setIsOpening(false);
          goToStatus();
        },
        onDismiss: () => setIsOpening(false),
        onFailed: (message) => {
          setIsOpening(false);
          showToast.error(message || 'Payment was not completed. Please try again.');
        },
      });
    } catch (err) {
      setIsOpening(false);
      showToast.error((err as Error)?.message || 'Could not open the payment window.');
    }
  }, [data, launch, reference, goToStatus]);

  return (
    <section
      className="min-h-screen w-full flex md:items-center justify-center pt-[100px] pb-20 md:py-[180px] px-5 relative bg-[#E6F5F9]"
      style={{
        backgroundImage: "url('/ticket_bg.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="w-full md:max-w-[480px] bg-white rounded-[24px] shadow-xl border border-gray-100 p-8 md:p-10 z-10 flex flex-col items-center gap-5 text-center h-fit">
        {isLoading || (data && !data.payment) ? (
          <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        ) : isError || !data ? (
          <>
            <AlertCircle className="w-14 h-14 text-amber-400" />
            <h1 className="text-[22px] font-bold text-[#1E1E1E]">
              Payment unavailable
            </h1>
            <p className="text-[14px] text-[#515151]">
              {(error as Error | null)?.message ||
                'We could not find this order. Please check the link.'}
            </p>
            <Link
              href="/tickets/buy"
              className="w-full flex items-center justify-center bg-[#1E1E1E] hover:bg-core-blue text-white py-4 rounded-[100px] font-bold transition-all"
            >
              Buy a Ticket
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-[22px] md:text-[26px] font-bold text-[#1E1E1E]">
              Complete your payment
            </h1>
            <p className="text-[14px] text-[#515151]">{data.ticket.name}</p>
            <p className="text-[32px] font-bold text-[#1E1E1E]">
              ₦
              {Number(data.amount).toLocaleString('en-NG', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-[12px] text-gray-500 font-mono break-all">
              Ref: {data.reference}
            </p>
            <button
              type="button"
              id="pay-order-btn"
              onClick={handlePay}
              disabled={isOpening}
              className="w-full flex items-center justify-center gap-2.5 bg-[#1E1E1E] hover:bg-core-blue disabled:bg-gray-400 text-white py-4 rounded-[100px] font-bold transition-all text-[15px] md:text-[16px] shadow-md disabled:cursor-not-allowed"
            >
              {isOpening ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              <span>{isOpening ? 'Opening payment...' : 'Pay Now'}</span>
            </button>
            <button
              type="button"
              onClick={goToStatus}
              className="text-[13px] text-[#515151] underline"
            >
              I have already paid
            </button>
          </>
        )}
      </div>

      <Image
        src="/ticket_footer_art.svg"
        alt=""
        width={1000}
        height={1000}
        className="w-full left-0 right-0 h-fit absolute bottom-0 pointer-events-none md:block hidden"
      />
    </section>
  );
}
