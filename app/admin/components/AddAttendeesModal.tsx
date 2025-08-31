import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import React, { SetStateAction, useState } from 'react';
import BankIcon from '@/app/_module/components/icons/BankIcon';
import SuccessModalIcon from '@/app/_module/components/icons/SuccessModalIcon';
import { formatAmount } from '@/utils/formatAmount';
import { useCreateAttendeeByAdmin } from '@/hooks/useAdminAuth';

interface Step {
  step: 'inputDetails' | 'sendPaymentLink' | 'showSuccessMessage';
  setStep: React.Dispatch<
    React.SetStateAction<
      'inputDetails' | 'sendPaymentLink' | 'showSuccessMessage'
    >
  >;
}

interface AttendeeData {
  fullName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
}

interface AddAttendeesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SuccessModal: React.FC<
  Step & { attendeeData: AttendeeData; setStep: any }
> = ({ step, setStep, attendeeData }) => {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      <div className="w-[100px] h-[100px] bg-green-500 rounded-full flex items-center justify-center mb-6">
        <SuccessModalIcon />
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Successful</h2>

      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Payment link sent!
      </h3>

      <p className="mb-[40px] text-[15px] tracking-[0.7px]">
        The payment link has been sent to {attendeeData.email}. Please inform
        the attendee to check their inbox (or spam folder) and complete the
        payment to secure their spot.
      </p>

      <Button
        className="w-full bg-[#1E1E1E] text-white py-[30px] rounded-[100px]"
        onClick={() => setStep('inputDetails')}
      >
        Go to Dashboard
      </Button>
    </div>
  );
};

const SendPaymentLink: React.FC<
  Step & {
    attendeeData: AttendeeData;
    setStep: React.Dispatch<
      React.SetStateAction<
        'inputDetails' | 'sendPaymentLink' | 'showSuccessMessage'
      >
    >;
    paymentUrl: string;
  }
> = ({ setStep, attendeeData, paymentUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentUrl ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => setStep('inputDetails')}
          className="mr-4 p-1 hover:bg-gray-100 rounded"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-[20px] font-bold text-[#515151]">Payment Link</h2>
      </div>

      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-[63px] h-[63px] bg-gray-100 rounded-lg flex items-center justify-center mb-4">
          <BankIcon />
        </div>

        <h3 className="text-xl font-bold mb-4">Payment Link</h3>

        <p className="text-[16px] mb-6 tracking-[0.5px]">
          You are about to send a payment link to the attendee email. Please
          confirm that the email address is correct before proceeding.
        </p>

        <div className="w-full bg-[#F7F7F7] rounded-[32px] pl-5 mb-4 flex items-center justify-between">
          <span className="text-sm py-3 font-mono text-gray-700">
            {paymentUrl ?? ''}
          </span>
          <Button
            variant="ghost"
            onClick={handleCopy}
            className="bg-[#4D4D4D] rounded-[32px] text-white font-bold text-[16px] h-full"
          >
            Copy
          </Button>
        </div>
      </div>

      <div className="space-y-4 mb-[50px]">
        <div className="flex justify-between items-center py-3 px-4 border border-[#DEDEDE] rounded-sm">
          <span className="text-gray-600 font-medium">Email</span>
          <span className="font-semibold text-gray-900">
            {attendeeData.email}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 px-4 border border-[#DEDEDE] rounded-sm">
          <span className="text-gray-600 font-medium">Amount</span>
          <span className="font-semibold text-gray-900">
            {formatAmount(4000)}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 px-4 border border-[#DEDEDE] rounded-sm">
          <span className="text-gray-600 font-medium">Description</span>
          <span className="font-semibold text-gray-900">
            DevFest_Ibadan_2025_Ticket
          </span>
        </div>
      </div>

      <Button
        className="w-full bg-[#1E1E1E] text-white py-[30px] rounded-[100px]"
        onClick={() => setStep('showSuccessMessage')}
      >
        Send payment link
      </Button>
    </div>
  );
};

const AddAttendeeDetails: React.FC<
  Step & {
    attendeeData: AttendeeData;
    setAttendeeData: React.Dispatch<React.SetStateAction<AttendeeData>>;
    setStep: React.Dispatch<
      React.SetStateAction<
        'inputDetails' | 'sendPaymentLink' | 'showSuccessMessage'
      >
    >;
    setPaymentUrl: (url: string) => void;
  }
> = ({ setStep, attendeeData, setAttendeeData }) => {
  const handleInputChange = (field: keyof AttendeeData, value: string) => {
    setAttendeeData((prev: AttendeeData) => ({
      ...prev,
      [field]: value,
    }));
  };

  const createAttendeeByAdminMutation = useCreateAttendeeByAdmin();

  const handleAddAttendee = () => {
    createAttendeeByAdminMutation.mutateAsync(attendeeData, {
      onSuccess: () => {
        setStep('sendPaymentLink');
      },
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6 gap-6">
        <button className="p-1 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-[20px] font-bold text-[#515151]">
          Add an Attendee
        </h2>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddAttendee();
        }}
      >
        <div className="grid grid-cols-2 gap-4 mb-[32px]">
          <div>
            <Label
              htmlFor="fullName"
              className="text-[#4D4D4D] text-[16px] font-medium mb-1 block"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              required
              placeholder="Enter Full Name"
              value={attendeeData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full border border-[#E6E6E6] rounded-[8px] h-[50px] outline-none focus:outline-none focus:ring-0"
            />
          </div>

          <div>
            <Label
              htmlFor="email"
              className="text-[#4D4D4D] text-[16px] font-medium mb-1 block"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="Enter email address"
              value={attendeeData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full border border-[#E6E6E6] rounded-[8px] h-[50px] outline-none focus:outline-none focus:ring-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-[32px]">
          <div>
            <Label
              htmlFor="phoneNumber"
              className="text-[#4D4D4D] text-[16px] font-medium mb-1 block"
            >
              Full Name
            </Label>
            <Input
              id="phoneNumber"
              required
              placeholder="e.g +234580458034"
              value={attendeeData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full border border-[#E6E6E6] rounded-[8px] h-[50px] outline-none focus:outline-none focus:ring-0"
            />
          </div>

          <div>
            <Label
              htmlFor="email"
              className="text-[#4D4D4D] text-[16px] font-medium mb-1 block"
            >
              Job Title/Occupation
            </Label>
            <Input
              id="jobTitle"
              type="text"
              placeholder="Enter your job title"
              value={attendeeData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              className="w-full border border-[#E6E6E6] rounded-[8px] h-[50px] outline-none focus:outline-none focus:ring-none"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#1E1E1E] text-white py-[30px] rounded-[100px]"
        >
          {createAttendeeByAdminMutation.isPending ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Creating...
            </div>
          ) : (
            'Create Attendee'
          )}
        </Button>
      </form>
    </div>
  );
};

const AddAttendeesModal: React.FC<AddAttendeesModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [step, setStep] = useState<
    'inputDetails' | 'sendPaymentLink' | 'showSuccessMessage'
  >('inputDetails');
  const [attendeeData, setAttendeeData] = useState<AttendeeData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    jobTitle: '',
  });
  const [paymentUrl, setPaymentUrl] = useState<string>('');

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setStep('inputDetails');
      setAttendeeData({
        fullName: '',
        email: '',
        phoneNumber: '',
        jobTitle: '',
      });
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0">
        {step === 'inputDetails' && (
          <AddAttendeeDetails
            step={step}
            setStep={setStep}
            attendeeData={attendeeData}
            setAttendeeData={setAttendeeData}
            setPaymentUrl={setPaymentUrl}
          />
        )}
        {step === 'sendPaymentLink' && (
          <SendPaymentLink
            step={step}
            setStep={setStep}
            attendeeData={attendeeData}
            paymentUrl={paymentUrl}
          />
        )}
        {step === 'showSuccessMessage' && (
          <SuccessModal
            step={step}
            setStep={setStep}
            attendeeData={attendeeData}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddAttendeesModal;
