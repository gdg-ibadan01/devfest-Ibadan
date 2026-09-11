import { useOrderByReference } from '@/app/_module/services';
import { showToast } from '@/app/_module/lib/notify';
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

  if (isLoading || isRefetching) {
    return <SuccessLoadingState />;
  }

  if (isError || !order) {
    const message =
      (error as Error | null)?.message ??
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
