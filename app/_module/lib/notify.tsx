import { toast } from 'sonner';
import { ToastContent } from '../components/common/Toast/ToastContent';

type NotifyType = 'success' | 'error' | 'info' | 'warning';

interface NotifyOptions {
  duration?: number;
}

export function notify(
  type: NotifyType,
  message: string,
  options: NotifyOptions = {}
) {
  toast.custom(
    () => <ToastContent type={type} message={message} />,
    {
      duration: options.duration ?? 4000,
      position: 'top-center',
    }
  );
}

export const showToast = {
  success: (message: string, options?: NotifyOptions) =>
    notify('success', message, options),
  error: (message: string, options?: NotifyOptions) =>
    notify('error', message, options),
  info: (message: string, options?: NotifyOptions) =>
    notify('info', message, options),
  warning: (message: string, options?: NotifyOptions) =>
    notify('warning', message, options),
};
