import { useOrderByReference } from '@/app/_module/services';
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
  } = useOrderByReference(reference);

  const handleDownload = () => {
    if (order?.ticket?.url) {
      window.open(order.ticket.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
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
