'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  AlertCircle,
  Calendar,
  Tag,
  Hash,
  RefreshCw,
  CreditCard,
  Image as ImageIcon,
} from 'lucide-react';
import type { GetOrderReferenceResponseDto } from '@/app/_module/api/types';
import { trackPurchase } from '@/utils/meta-pixel';
import { trackPurchase as trackTikTokPurchase } from '@/utils/tiktok-pixel';
import { trackPurchase as trackGAPurchase } from '@/utils/google-analytics';
import StatusBadge from './StatusBadge';
import DetailRow from './DetailRow';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface SuccessOrderCardProps {
  order: GetOrderReferenceResponseDto;
  reference: string | null;
  onDownload: () => void;
  onReset?: () => void;
  resetButtonLabel?: string;
  onRefetch?: () => void;
  isRefetching?: boolean;
  /** Reopens the payment popup for this same order. */
  onCompletePayment?: () => void;
  isCompletingPayment?: boolean;
}

export default function SuccessOrderCard({
  order,
  reference,
  onDownload,
  onReset,
  resetButtonLabel,
  onRefetch,
  isRefetching,
  onCompletePayment,
  isCompletingPayment,
}: Readonly<SuccessOrderCardProps>) {
  const isPaid = order.status === 'PAID';
  const isAwaitingPayment = order.status === 'AWAITING_PAYMENT';
  const isExpired =
    isAwaitingPayment &&
    !!order.expiresAt &&
    new Date(order.expiresAt).getTime() <= Date.now();

  useEffect(() => {
    if (order.status === 'PAID') {
      const orderPayload = {
        amount: Number(order.amount),
        reference: reference || order.code,
        ticketType: order.ticket.name,
        quantity: 1,
      };
      trackPurchase(orderPayload);
      trackTikTokPurchase(orderPayload);
      trackGAPurchase(orderPayload);
    }
  }, [order.status, order.amount, reference, order.code, order.ticket.name]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full md:max-w-[560px] md:bg-white md:rounded-[24px] md:shadow-xl md:border border-gray-100 overflow-hidden mb-6 md:mb-10"
    >
      {/* Header */}
      <div className="px-6 pt-8 pb-6 md:px-10 md:pt-10 flex flex-col items-center gap-4">
        <motion.div
          initial={{ scale: 0.3, rotate: -15, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 220,
            damping: 16,
            delay: 0.15,
          }}
        >
          {isPaid ? (
            <Image
              src="/success.png"
              alt="Payment Successful"
              width={200}
              height={200}
              className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] object-contain select-none pointer-events-none"
              priority
            />
          ) : (
            <div className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] flex items-center justify-center">
              <AlertCircle className="w-24 h-24 text-amber-400" />
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="flex flex-col items-center gap-2"
        >
          <h1 className="text-[22px] md:text-[26px] font-bold text-[#1E1E1E] text-center">
            {isPaid ? 'Payment Successful! 🎉' : 'Order Status'}
          </h1>
          <StatusBadge status={order.status} />
        </motion.div>
      </div>

      {/* Details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="px-6 md:px-10 pb-10 md:pb-12"
      >
        <div className="bg-[#FAF8F5] rounded-[16px] px-5 py-2 mb-6">
          {order.ticket?.name && (
            <DetailRow
              icon={<Tag size={16} />}
              label="Ticket Type"
              value={order.ticket.name}
            />
          )}

          {order.ticket?.validityDates &&
            order.ticket.validityDates.length > 0 && (
              <DetailRow
                icon={<Calendar size={16} />}
                label="Valid For"
                value={order.ticket.validityDates.map(formatDate).join(' · ')}
              />
            )}

          <DetailRow
            icon={
              <span className="text-[14px] font-bold leading-none">₦</span>
            }
            label={isPaid ? 'Amount Paid' : 'Amount'}
            value={`₦${Number(order.amount).toLocaleString('en-NG', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          />

          {order.code && (
            <DetailRow
              icon={<Hash size={16} />}
              label="Ticket Code"
              value={
                <span className="font-mono tracking-widest">{order.code}</span>
              }
            />
          )}

          {reference && (
            <DetailRow
              icon={<Hash size={16} />}
              label="Payment Reference"
              value={
                <span className="font-mono text-[13px] text-gray-600 break-all">
                  {reference}
                </span>
              }
            />
          )}
        </div>

        {isPaid ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.3 }}
            className="text-[13px] text-[#515151] font-sans text-center mb-6 leading-relaxed"
          >
            Present your downloaded ticket at the registration stand on event
            day. A copy has also been sent to your email.
          </motion.p>
        ) : order.status === 'AWAITING_PAYMENT' ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.3 }}
            className="text-[13px] text-[#515151] font-sans text-center mb-6 leading-relaxed"
          >
            {isExpired
              ? 'This order has expired. If you already paid, refresh the status; otherwise start a new purchase.'
              : 'If you have paid, we are confirming it with the payment gateway (bank transfers can take a few minutes) and your ticket will be emailed to you. If you have not paid yet, click Complete Payment.'}
          </motion.p>
        ) : null}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {isPaid && (
              <motion.button
                key="download-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                type="button"
                id="download-ticket-btn"
                onClick={onDownload}
                className="w-full flex items-center justify-center gap-2.5 bg-[#1E1E1E] hover:bg-core-blue disabled:bg-gray-400 text-white py-4 rounded-[100px] font-bold transition-all text-[15px] md:text-[16px] font-sans shadow-md hover:shadow-lg disabled:cursor-not-allowed cursor-pointer focus:outline-none"
              >
                <Download className="w-4 h-4" />
                <span>Download Ticket</span>
              </motion.button>
            )}
          </AnimatePresence>

          {isPaid && (
            <motion.div
              key="flyer-link"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: 0.3 }}
            >
              <Link
                href="/flyer"
                id="create-flyer-btn"
                className="w-full flex items-center justify-center gap-2.5 border-2 border-[#1E1E1E] hover:bg-black/5 text-[#1E1E1E] py-3.5 rounded-[100px] font-bold transition-all text-[15px] md:text-[16px] font-sans focus:outline-none"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Create your attendee flyer</span>
              </Link>
            </motion.div>
          )}

          {isAwaitingPayment && !isExpired && onCompletePayment && (
            <motion.button
              key="complete-payment-btn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.3 }}
              type="button"
              id="complete-payment-btn"
              onClick={onCompletePayment}
              disabled={isCompletingPayment}
              className="w-full flex items-center justify-center gap-2.5 bg-core-blue hover:bg-[#1E1E1E] disabled:bg-gray-400 text-white py-4 rounded-[100px] font-bold transition-all text-[15px] md:text-[16px] font-sans shadow-md hover:shadow-lg disabled:cursor-not-allowed cursor-pointer focus:outline-none"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {isCompletingPayment ? 'Opening payment...' : 'Complete Payment'}
              </span>
            </motion.button>
          )}

          {/* Refetch / Refresh Button when AWAITING_PAYMENT */}
          {order.status === 'AWAITING_PAYMENT' && onRefetch && (
            <motion.button
              key="refetch-btn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              type="button"
              id="refresh-order-status-btn"
              onClick={onRefetch}
              disabled={isRefetching}
              className="w-full flex items-center justify-center gap-2.5 bg-[#1E1E1E] hover:bg-core-blue disabled:bg-gray-400 text-white py-4 rounded-[100px] font-bold transition-all text-[15px] md:text-[16px] font-sans shadow-md hover:shadow-lg disabled:cursor-not-allowed cursor-pointer focus:outline-none"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`}
              />
              <span>{isRefetching ? 'Checking Status...' : 'Refresh Status'}</span>
            </motion.button>
          )}

          {onReset && (
            <motion.button
              key="reset-btn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isPaid || order.status === 'AWAITING_PAYMENT' ? 0.65 : 0.45, duration: 0.3 }}
              type="button"
              id="buy-another-ticket-btn"
              onClick={onReset}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-[100px] font-bold transition-all text-[15px] md:text-[16px] font-sans cursor-pointer focus:outline-none ${
                isPaid || order.status === 'AWAITING_PAYMENT'
                  ? 'border-2 border-[#1E1E1E] hover:bg-black/5 text-[#1E1E1E]'
                  : 'bg-[#1E1E1E] hover:bg-core-blue text-white shadow-md'
              }`}
            >
              <span>{resetButtonLabel ?? 'Buy Another Ticket'}</span>
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
