/**
 * @deprecated Payments now go through the gateway-agnostic launcher, which
 * opens ALATPay or Monnify depending on what the server chose for the order.
 */
export {
  usePaymentLauncher as useMakePayment,
  usePaymentLauncher,
  confirmPayment,
} from './payments/usePaymentLauncher';
