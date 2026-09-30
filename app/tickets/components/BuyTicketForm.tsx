import React, { useState } from 'react';
import GroupAttendeeFields from './GroupAttendeeFields';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import BuyerDetailsFields, {
  type BuyerDetailsFieldsProps,
} from './BuyerDetailsFields';
import GiftRecipientFields, {
  type GiftRecipientFieldsProps,
} from './GiftRecipientFields';
import TicketPackageSelector, {
  type TicketPackageSelectorProps,
} from './TicketPackageSelector';
import TicketDiscountField, {
  type TicketDiscountFieldProps,
} from './TicketDiscountField';

interface BuyTicketFormProps
  extends
    BuyerDetailsFieldsProps,
    GiftRecipientFieldsProps,
    TicketPackageSelectorProps,
    TicketDiscountFieldProps {
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export default function BuyTicketForm({
  fullName,
  setFullName,
  email,
  setEmail,
  isGift,
  setIsGift,
  receiverName,
  setReceiverName,
  receiverEmail,
  setReceiverEmail,
  receiverPhone,
  setReceiverPhone,
  selectedPackageId,
  setSelectedPackageId,
  packages,
  onSubmit,
  onBack,
  discountCode,
  setDiscountCode,
  appliedDiscount,
  onApplyDiscount,
  onRemoveDiscount,
  isApplyingDiscount,
  discountError,
  setDiscountError,
  isDiscountFromUrl,
}: Readonly<BuyTicketFormProps>) {
  const isGroupTicket = selectedPackageId.toLowerCase().includes('group');
  const [attendeeEmails, setAttendeeEmails] = useState(['', '']);
  const [savedGroupDetails, setSavedGroupDetails] = useState('');
  const groupDetails = JSON.stringify({ fullName, email, attendeeEmails });

  const baseInvalid = !fullName.trim() || !email.trim() || !selectedPackageId;
  const giftInvalid = isGift
    ? !receiverName.trim() || !receiverEmail.trim() || !receiverPhone.trim()
    : false;
  const isFormInvalid = baseInvalid || giftInvalid;

  return (
    <div className="w-full md:max-w-[732px] md:bg-white md:rounded-[20px] md:shadow-lg md:border border-gray-100 overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-6 md:mb-8 md:bg-[#F0F0F0] md:p-24">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-24 h-24 rounded-full hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft className="w-full h-full text-[#515151]" />
        </button>
        <h1 className="text-20 md:text-24 font-bold text-[#515151]">
          Buy Ticket
        </h1>
      </div>

      <div className="w-full md:px-5 md:pb-24">
        <form
          onSubmit={(event) => {
            if (isGroupTicket) {
              event.preventDefault();
              return;
            }
            onSubmit(event);
          }}
          className="flex flex-col gap-5"
        >
          {!isGroupTicket && (
            <>
              <BuyerDetailsFields
                fullName={fullName}
                setFullName={setFullName}
                email={email}
                setEmail={setEmail}
                isGift={isGift}
              />

              <GiftRecipientFields
                isGift={isGift}
                setIsGift={setIsGift}
                receiverName={receiverName}
                setReceiverName={setReceiverName}
                receiverEmail={receiverEmail}
                setReceiverEmail={setReceiverEmail}
                receiverPhone={receiverPhone}
                setReceiverPhone={setReceiverPhone}
              />
            </>
          )}

          <TicketPackageSelector
            selectedPackageId={selectedPackageId}
            setSelectedPackageId={setSelectedPackageId}
            packages={packages}
          />

          {isGroupTicket && (
            <GroupAttendeeFields
              fullName={fullName}
              setFullName={setFullName}
              email={email}
              setEmail={setEmail}
              attendeeEmails={attendeeEmails}
              onAttendeeEmailsChange={setAttendeeEmails}
              isSaved={savedGroupDetails === groupDetails}
              onSave={() => setSavedGroupDetails(groupDetails)}
            />
          )}

          <TicketDiscountField
            discountCode={discountCode}
            setDiscountCode={setDiscountCode}
            appliedDiscount={appliedDiscount}
            onApplyDiscount={onApplyDiscount}
            onRemoveDiscount={onRemoveDiscount}
            isApplyingDiscount={isApplyingDiscount}
            discountError={discountError}
            setDiscountError={setDiscountError}
            isDiscountFromUrl={isDiscountFromUrl}
          />

          {isGroupTicket ? (
            <div className="flex flex-col items-end gap-12 mt-24">
              <p id="groupCheckoutNotice" className="text-[13px] text-gray-500">
                Group checkout is not available yet.
              </p>
              <button
                type="button"
                disabled
                aria-describedby="groupCheckoutNotice"
                className="h-56 w-full sm:w-[205px] rounded-[100px] bg-[#1E1E1E] text-[16px] text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          ) : (
            <>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isFormInvalid}
                className="w-full bg-[#1E1E1E] py-4 text-white hover:bg-core-blue rounded-[100px] flex gap-2 justify-center items-center transition-colors duration-500 font-bold my-2 md:my-4 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1E1E1E]"
              >
                Proceed to Payment <ArrowUpRight className="w-5 h-5" />
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
