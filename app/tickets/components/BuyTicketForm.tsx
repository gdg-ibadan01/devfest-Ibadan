import React, { useState, useEffect } from 'react';
import GroupAttendeeFields, { type GroupMember } from './GroupAttendeeFields';
import { AlertCircle, ArrowLeft, ArrowUpRight } from 'lucide-react';
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
  groupMembers?: GroupMember[];
  setGroupMembers?: (members: GroupMember[]) => void;
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
  groupMembers,
  setGroupMembers,
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
  const currentPackage = packages.find((p) => p.id === selectedPackageId);
  const isGroupTicket = Boolean(
    (currentPackage?.seatsPerUnit && currentPackage.seatsPerUnit > 1) ||
    selectedPackageId.toLowerCase().includes('group')
  );
  const [internalGroupMembers, setInternalGroupMembers] = useState<
    GroupMember[]
  >([
    { fullName: '', email: '' },
    { fullName: '', email: '' },
  ]);

  useEffect(() => {
    if (!isGroupTicket || !currentPackage || groupMembers) return;
    const targetCount = Math.max(2, (currentPackage.seatsPerUnit || 3) - 1);
    setInternalGroupMembers((prev) => {
      if (prev.length === targetCount) return prev;
      const next: GroupMember[] = [];
      for (let i = 0; i < targetCount; i++) {
        next.push(prev[i] ?? { fullName: '', email: '' });
      }
      return next;
    });
  }, [isGroupTicket, currentPackage, groupMembers]);

  const members = groupMembers ?? internalGroupMembers;
  const setMembers = setGroupMembers ?? setInternalGroupMembers;

  const baseInvalid = !fullName.trim() || !email.trim() || !selectedPackageId;
  const giftInvalid = isGift
    ? !receiverName.trim() || !receiverEmail.trim() || !receiverPhone.trim()
    : false;

  const groupLeadInvalid =
    fullName.trim().length < 3 || !email.trim() || !email.includes('@');
  const groupMembersInvalid =
    members.length < 2 ||
    members.some(
      (m) =>
        m.fullName.trim().length < 3 ||
        !m.email.trim() ||
        !m.email.includes('@')
    );
  const allGroupEmails = [
    email.trim().toLowerCase(),
    ...members.map((m) => m.email.trim().toLowerCase()),
  ].filter(Boolean);
  const hasDuplicateEmails =
    new Set(allGroupEmails).size !== allGroupEmails.length;

  const isFormInvalid = isGroupTicket
    ? groupLeadInvalid || groupMembersInvalid || hasDuplicateEmails
    : baseInvalid || giftInvalid;

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
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
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
            <>
              <GroupAttendeeFields
                fullName={fullName}
                setFullName={setFullName}
                email={email}
                setEmail={setEmail}
                groupMembers={members}
                onGroupMembersChange={setMembers}
                maxAttendees={currentPackage?.seatsPerUnit}
              />
              {hasDuplicateEmails && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-[8px] p-3 text-[13px]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Each attendee in the group must have a unique email address.
                  </span>
                </div>
              )}
            </>
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isFormInvalid}
            className="w-full bg-[#1E1E1E] py-4 text-white hover:bg-core-blue rounded-[100px] flex gap-2 justify-center items-center transition-colors duration-500 font-bold my-2 md:my-4 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1E1E1E] cursor-pointer"
          >
            Proceed to Payment <ArrowUpRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
