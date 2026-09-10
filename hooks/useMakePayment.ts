import Monnify from 'monnify-ts';

interface MonnifyResponse {
  /** Amount that was to be paid. */
  amount: number;
  /** Amount that was actually paid. */
  amountPaid: number;
  /** Indicates if the transaction was completed successfully. */
  completed: boolean;
  /** Timestamp of when the transaction was completed. */
  completedOn: string;
  /** Timestamp of when the transaction was created. */
  createdOn: string;
  /** Currency code of the payment (e.g., 'NGN'). */
  currencyCode: string;
  /** Email address of the customer who made the payment. */
  customerEmail: string;
  /** Full name of the customer who made the payment. */
  customerName: string;
  /** Fees charged for the transaction. */
  fee: number;
  /** Metadata related to the transaction, such as device type and IP address. */
  metaData: Record<string, any>;
  /** Total amount due for payment. */
  payableAmount: number;
  /** Method used for payment (e.g., 'CARD'). */
  paymentMethod: string;
  /** Unique reference for the payment transaction. */
  paymentReference: string;
  /** Current status of the payment (e.g., 'PAID'). */
  paymentStatus: string;
  /** Unique transaction reference. */
  transactionReference: string;
}

type PaymentParams = {
  amount: number;
  orderId: string;
  reference: string;
  customerEmail: string;
  customerFullName: string;
  paymentDescription: string;
  onComplete: (response: MonnifyResponse) => void;
};

export const useMakePayment = () => {
  const apiKey = process.env.NEXT_PUBLIC_MONNIFY_API_KEY;
  const contractCode = process.env.NEXT_PUBLIC_MONIFY_CONTRACT_CODE;

  const makePayment = ({
    amount,
    orderId,
    reference,
    customerEmail,
    customerFullName,
    paymentDescription,
    onComplete,
  }: PaymentParams) => {
    if (!apiKey || !contractCode) {
      throw new Error('Monnify API key or contract code is missing');
    }

    const monnify = new Monnify(apiKey, contractCode);

    monnify.initializePayment({
      amount,
      currency: 'NGN',
      reference,
      customerFullName,
      customerEmail,
      paymentDescription,
      metadata: {
        orderId,
      },

      onComplete,
      //   onComplete: (response) => {
      //     console.log('Payment completed:', response);

      //     window.location.href = `/tickets/success?paymentReference=${encodeURIComponent(
      //       response.paymentReference
      //     )}`;
      //   },

      onClose: (data) => {
        console.log('Payment modal closed:', data);
      },

      onLoadComplete: () => {
        console.log('Payment modal loaded');
      },

      onLoadStart: () => {
        console.log('Payment modal loading...');
      },
    });
  };

  return { makePayment };
};
