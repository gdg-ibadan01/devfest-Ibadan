/** Callbacks every payment popup adapter reports through. */
export interface CheckoutHandlers {
  /**
   * Gateway says paid; confirm with the API. The ref is missing when the
   * gateway didn't return one (ALATPay cards): the API looks it up.
   */
  onSuccess: (transactionRef?: string) => void;
  /** Started but not final yet (e.g. bank transfer in flight). */
  onPending: (transactionRef?: string) => void;
  onFailed: (message?: string) => void;
  /** Closed without completing. */
  onDismiss: () => void;
  /** Popup is visible. */
  onOpened?: () => void;
}
