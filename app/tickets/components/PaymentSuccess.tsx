import { isNotFound, useOrderByReference } from '@/app/_module/services';
import { showToast } from '@/app/_module/lib/notify';
import { useResumePayment } from '@/hooks/payments/useResumePayment';
import {
  SuccessErrorState,
  SuccessLoadingState,
  SuccessOrderCard,
} from '../success/components';

interface PaymentSuccessProps {
  reference: string;
  onReset?: () => void;
  resetButtonLabel?: string;
}

function SuccessContent({
  reference,
  onReset,
  resetButtonLabel = 'Buy Another Ticket',
}: Readonly<PaymentSuccessProps>) {
  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useOrderByReference(reference);
  const { resume, isResuming } = useResumePayment(reference);

  const handleDownload = () => {
    if (order?.ticket?.url) {
      window.open(order.ticket.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRefetch = async () => {
    try {
      const res = await refetch();
      if (res.data?.status === 'PAID') {
        showToast.success('Payment confirmed! Ticket is ready.');
      } else {
        showToast.info('Payment still awaiting confirmation.');
      }
    } catch {
      showToast.error('Failed to check payment status.');
    }
  };

  if (isLoading) {
    return <SuccessLoadingState />;
  }

  if (isError && !isNotFound(error)) {
    return (
      <SuccessErrorState
        title="We couldn't check your order"
        message="We're having trouble reaching our servers. If you've paid, your payment is safe and your ticket will be emailed to you. We'll keep checking."
        reference={reference}
        onRetry={() => void refetch()}
        isRetrying={isRefetching}
      />
    );
  }

  if (isError || !order) {
    const message =
      'We could not find your order. Please check the link or contact support.';
    return (
      <SuccessErrorState
        message={message}
        reference={reference}
        onReset={onReset}
        resetButtonLabel="Back to Ticket Form"
      />
    );
  }

  return (
    <SuccessOrderCard
      order={order}
      reference={reference}
      onDownload={handleDownload}
      onReset={onReset}
      resetButtonLabel={resetButtonLabel}
      onRefetch={handleRefetch}
      isRefetching={isRefetching}
      onCompletePayment={resume}
      isCompletingPayment={isResuming}
    />
  );
}

export default function PaymentSuccess({
  reference,
  onReset,
  resetButtonLabel,
}: Readonly<PaymentSuccessProps>) {
  return (
    <SuccessContent
      reference={reference}
      onReset={onReset}
      resetButtonLabel={resetButtonLabel}
    />
  );
}
