'use client';

import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import AdminWrapper from '@/app/_module/components/common/AdminWrapper';
import {
  usePaymentGateway,
  useSetPaymentGateway,
} from '@/app/_module/services';
import type { PaymentGatewayStatus } from '@/app/_module/api/types';
import { cn } from '@/app/_module/lib/utils';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function LastChanged({ status }: { status: PaymentGatewayStatus }) {
  if (status.source === 'ENV' || !status.updatedAt) {
    return (
      <p className="text-[12px] text-gray-500">
        Using the server default. No one has switched the gateway from here yet.
      </p>
    );
  }
  return (
    <p className="text-[12px] text-gray-500">
      Last switched {status.updatedBy ? `by ${status.updatedBy.fullName} ` : ''}
      on {formatDate(status.updatedAt)}.
    </p>
  );
}

export default function PaymentGatewayPageClient() {
  const { data: status, isLoading, isError, error } = usePaymentGateway();
  const switchGateway = useSetPaymentGateway();

  const labelOf = (name: string) =>
    status?.providers.find((p) => p.name === name)?.label ?? name;

  return (
    <AdminWrapper title="Payment Gateway">
      <div className="max-w-[760px] px-[20px] py-[24px] lg:px-[32px]">
        <p className="mb-[20px] text-[14px] text-gray-600">
          Choose the gateway new ticket orders pay with. Orders that have
          already started finish on the gateway they began with, so you can
          switch at any time without affecting anyone mid-payment.
        </p>

        {isLoading ? (
          <div className="flex h-[160px] items-center justify-center">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        ) : isError || !status ? (
          <p className="rounded-xl border border-gray-200 bg-white p-[24px] text-[14px] text-red-600">
            {(error as { status?: number } | null)?.status === 403
              ? "You don't have permission to view the payment gateway."
              : 'Could not load the payment gateway settings.'}
          </p>
        ) : (
          <>
            {status.active !== status.selected && (
              <div className="mb-[16px] flex items-start gap-[10px] rounded-xl border border-amber-200 bg-amber-50 p-[14px] text-[13px] text-amber-800">
                <AlertTriangle size={18} className="mt-[1px] shrink-0" />
                <p>
                  {labelOf(status.selected)} was selected but is missing its
                  credentials on the server, so new orders are using{' '}
                  {labelOf(status.active)} instead.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-[12px]">
              {status.providers.map((provider) => {
                const isActive = provider.name === status.active;
                const isSwitchingHere =
                  switchGateway.isPending &&
                  switchGateway.variables === provider.name;

                return (
                  <div
                    key={provider.name}
                    className={cn(
                      'flex flex-col gap-[12px] rounded-xl border bg-white p-[16px] md:flex-row md:items-center md:justify-between',
                      isActive ? 'border-green-300' : 'border-gray-200'
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-[8px]">
                        <p className="text-[15px] font-semibold text-[#1e1e1e]">
                          {provider.label}
                        </p>
                        {isActive && (
                          <span className="inline-flex items-center gap-[4px] rounded-full bg-green-50 px-[8px] py-[2px] text-[12px] font-medium text-green-700">
                            <CheckCircle2 size={12} /> Live for new orders
                          </span>
                        )}
                      </div>
                      <p className="mt-[2px] text-[13px] text-gray-500">
                        {provider.configured
                          ? 'Credentials configured on the server.'
                          : 'Not configured: its keys are missing on the server.'}
                      </p>
                    </div>

                    {!isActive && (
                      <button
                        type="button"
                        disabled={
                          !provider.configured || switchGateway.isPending
                        }
                        onClick={() => {
                          if (
                            window.confirm(
                              `Switch new orders to ${provider.label}?\n\nOrders already started will still finish on ${labelOf(status.active)}.`
                            )
                          ) {
                            switchGateway.mutate(provider.name);
                          }
                        }}
                        className="inline-flex h-[40px] items-center justify-center gap-[8px] rounded-lg bg-[#1e1e1e] px-[16px] text-[13px] font-medium text-white hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSwitchingHere && (
                          <Loader2 size={14} className="animate-spin" />
                        )}
                        Switch to {provider.label}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-[16px]">
              <LastChanged status={status} />
            </div>
          </>
        )}
      </div>
    </AdminWrapper>
  );
}
