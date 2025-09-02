import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import BankIcon from '@/app/_module/components/icons/BankIcon';
import SuccessModalIcon from '@/app/_module/components/icons/SuccessModalIcon';

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
  selectedPackage: 'friday' | 'saturday' | 'both';
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
        className="w-full bg-[#1E1E1E] text-white text-white py-[30px] rounded-[100px]"
        onClick={() => setStep('inputDetails')}
      >
        Go to Dashboard
      </Button>
    </div>
  );
};

const SendPaymentLink: React.FC<
  Step & { attendeeData: AttendeeData; setStep: any }
> = ({ step, setStep, attendeeData }) => {
  const [copied, setCopied] = useState(false);

  const paymentLink = 'https://pay.rywo.co/evt-12345';

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getAmount = () => {
    switch (attendeeData.selectedPackage) {
      case 'friday':
        return '₦4,000';
      case 'saturday':
        return '₦4,000';
      case 'both':
        return '₦8,000';
      default:
        return '₦5,000';
    }
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
            {paymentLink}
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
          <span className="font-semibold text-gray-900">{getAmount()}</span>
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
  Step & { attendeeData: AttendeeData; setAttendeeData: any; setStep: any }
> = ({ step, setStep, attendeeData, setAttendeeData }) => {
  const handleInputChange = (field: keyof AttendeeData, value: string) => {
    setAttendeeData((prev: AttendeeData) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePackageSelect = (packageType: 'friday' | 'saturday' | 'both') => {
    setAttendeeData((prev: AttendeeData) => ({
      ...prev,
      selectedPackage: packageType,
    }));
  };

  const isFormValid =
    attendeeData.fullName.trim() !== '' &&
    attendeeData.email.trim() !== '' &&
    attendeeData.email.includes('@');

  const plans = [
    {
      label: 'Friday',
      description: 'Workshop',
      price: 4000,
    },
    {
      label: 'Saturday',
      description: 'Main event & Workshop',
      price: 8000,
    },
    {
      label: 'Both',
      description: 'Main event & Workshop',
      price: 12000,
    },
  ];

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
            placeholder="Enter email address"
            value={attendeeData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full border border-[#E6E6E6] rounded-[8px] h-[50px] outline-none focus:outline-none focus:ring-none"
          />
        </div>
      </div>

      <div className="mb-[32px]">
        <Label className="text-[#878787] font-medium mb-[24px] block">
          Kindly Select your Ticket Package
        </Label>

        <RadioGroup
          defaultValue="friday"
          className="flex flex-col space-y-[10px]"
        >
          {plans.map((plan) => (
            <Label
              key={plan.label}
              htmlFor={`plan-${plan.label.toLowerCase()}`}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                attendeeData.selectedPackage === plan.label.toLowerCase()
                  ? 'bg-[#C3ECF6] border-[#9AE0F1]'
                  : 'border-[#DEDEDE]'
              }`}
              onClick={() =>
                handlePackageSelect(
                  plan.label.toLowerCase() as 'friday' | 'saturday' | 'both'
                )
              }
            >
              <div className="flex items-center gap-4">
                <RadioGroupItem
                  value={plan.label.toLowerCase()}
                  id={`plan-${plan.label.toLowerCase()}`}
                  className={`${attendeeData.selectedPackage === plan.label.toLowerCase() ? 'text-[#4285F4] bg-[#C3ECF6] border border-[#4285F4]' : 'text-[#6B6B6B] bg-white border border-[#6b6b6b]'}`}
                />
                <div className="flex flex-col gap-[9px]">
                  <div
                    className={`font-medium text-[17px] ${attendeeData.selectedPackage === plan.label.toLowerCase() ? 'text-[#5787D6]' : 'text-[#636363]'} `}
                  >
                    {plan.label}{' '}
                    <span
                      className={`font-light text-[12px] ${attendeeData.selectedPackage === plan.label.toLowerCase() ? 'text-[#5787D6]' : 'text-[#636363]'}`}
                    >
                      ({plan.description})
                    </span>
                  </div>
                  <div
                    className={`text-[20px] font-semibold ${attendeeData.selectedPackage === plan.label.toLowerCase() ? 'text-[#4285F4]' : 'text-[#6B6B6B]'}`}
                  >
                    ₦{plan.price}
                  </div>
                </div>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <Button
        className="w-full bg-[#1E1E1E] text-white text-white py-[30px] rounded-[100px]"
        onClick={() => setStep('sendPaymentLink')}
      >
        Check out
      </Button>
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
    selectedPackage: 'friday',
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setStep('inputDetails');
      setAttendeeData({
        fullName: '',
        email: '',
        selectedPackage: 'friday',
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
          />
        )}
        {step === 'sendPaymentLink' && (
          <SendPaymentLink
            step={step}
            setStep={setStep}
            attendeeData={attendeeData}
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
