'use client';

import { ArrowUpRight, Loader2, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useCallback, type FormEvent } from 'react';
import { Button } from '../_module/components/ui/button';
import { CustomInput } from '../_module/components/ui/input';
import { CustomSelect } from '../_module/components/ui/select';

const GOOGLE_FORM_ACTION_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSczob1oVX9qrE--bkzj_jiQ-mX5wM3ZigaVdhJCxNBL0Va0VQ/formResponse';

/**
 * Google Form entry IDs mapped to each field.
 * Extracted from the form's `data-params` attributes.
 */
const ENTRY_IDS = {
  name: 'entry.2092238618',
  email: 'entry.1556369182',
  gender: 'entry.1214893541',
  phoneNumber: 'entry.479301265',
  numberOfSeats: 'entry.1753222212',
  howDidYouHear: 'entry.588393791',
} as const;

export default function Rsvp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    gender: '',
    numberOfSeats: '',
    howDidYouHear: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const STORAGE_KEY = 'devfest_ibadan_2026_rsvp';

  const getSubmittedEmails = useCallback((): string[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const markEmailAsSubmitted = useCallback((email: string) => {
    const emails = getSubmittedEmails();
    if (!emails.includes(email.toLowerCase())) {
      emails.push(email.toLowerCase());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
    }
  }, [getSubmittedEmails]);

  /**
   * Matches Nigerian phone numbers:
   * +234 followed by 10 digits, 234 followed by 10 digits, or 0 followed by 10 digits.
   */
  const NIGERIAN_PHONE_REGEX = /^(\+234|234|0)[789]\d{9}$/;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phoneNumber') {
      // Allow only digits and a leading '+'
      const sanitized = value.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate required dropdowns
    if (!formData.gender || !formData.numberOfSeats || !formData.howDidYouHear) {
      setError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    // Validate Nigerian phone number format
    if (!NIGERIAN_PHONE_REGEX.test(formData.phoneNumber)) {
      setError('Please enter a valid Nigerian phone number (e.g. +2348012345678 or 08012345678).');
      setIsSubmitting(false);
      return;
    }

    // Check for duplicate submission
    const submittedEmails = getSubmittedEmails();
    if (submittedEmails.includes(formData.email.toLowerCase())) {
      setError('This email has already been used to register. Please use a different email address.');
      setIsSubmitting(false);
      return;
    }

    // Build the URL-encoded body mapping to Google Form entry IDs
    const body = new URLSearchParams();
    body.append(ENTRY_IDS.name, formData.name);
    body.append(ENTRY_IDS.email, formData.email);
    body.append(ENTRY_IDS.gender, formData.gender);
    body.append(ENTRY_IDS.phoneNumber, formData.phoneNumber);
    body.append(ENTRY_IDS.numberOfSeats, formData.numberOfSeats);
    body.append(ENTRY_IDS.howDidYouHear, formData.howDidYouHear);

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        mode: 'no-cors', // Google Forms doesn't support CORS, so we use no-cors
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      // With `no-cors`, the response is opaque — we can't read it.
      // If the request didn't throw, we treat it as a successful submission.
      markEmailAsSubmitted(formData.email);
      setIsSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      gender: '',
      numberOfSeats: '',
      howDidYouHear: '',
    });
    setIsSubmitted(false);
    setError(null);
  };

  return (
    <main
      className="md:pt-[100px] pt-[80px] mains min-h-screen"
      style={{
        backgroundImage: "url('/pastel-blue-art.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom',
        backgroundSize: 'cover',
      }}
    >
      <div className="w-full md:max-w-[500px] mx-auto bg-white rounded-[12px] overflow-hidden">
        <div className="w-full h-fit relative">
          <Image
            width={1000}
            height={1000}
            src="/rsvp_banner.png"
            alt="RSVP Banner"
            className="w-full object-cover object-center"
          />
          <div className="w-full h-1/2 absolute bottom-0 bg-gradient-to-b from-transparent from-[50.04%] to-white to-[99.69%]" />
        </div>
        <div className="px-4 md:px-9 py-4 space-y-4">
          <div className="space-y-1">
            <h1 className="font-bold text-lg">DevFest Ibadan 2026 - Early bird Seat Reservation</h1>
            <p className="text-sm text-[#666666]">
              Please fill out your details to reserve your ticket.
            </p>
          </div>

          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
              <CheckCircle2 size={48} color="#51AE57" strokeWidth={1.5} />
              <h2 className="text-xl font-semibold text-gray-800">Registration Successful!</h2>
              <p className="text-sm text-gray-500">
                Thank you for reserving your seat.
              </p>
              <Button
                type="button"
                variant="outline"
                className="rounded-lg mt-4"
                onClick={handleReset}
              >
                Submit another response
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <CustomInput
                label="Full Name"
                placeholder="Enter your full name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <CustomInput
                label="Email Address"
                placeholder="you@example.com"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <CustomInput
                label="Phone Number"
                placeholder="+2348012345678"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                maxLength={14}
                required
              />
              <CustomSelect
                label="Gender"
                placeholder="Select Gender"
                value={formData.gender}
                onValueChange={handleSelectChange('gender')}
                options={[
                  { label: 'Male', value: 'Male' },
                  { label: 'Female', value: 'Female' },
                ]}
              />
              <CustomSelect
                label="Number of Seats"
                placeholder="Select number of seats"
                value={formData.numberOfSeats}
                onValueChange={handleSelectChange('numberOfSeats')}
                options={[
                  { label: '1', value: '1' },
                  { label: '2', value: '2' },
                  { label: '3', value: '3' },
                  { label: '4', value: '4' },
                  { label: '5', value: '5' },
                  { label: '5+', value: '5+' },
                ]}
              />
              <CustomSelect
                label="How did you hear about DevFest?"
                placeholder="Select an option"
                value={formData.howDidYouHear}
                onValueChange={handleSelectChange('howDidYouHear')}
                options={[
                  { label: 'Social Media', value: 'Social Media' },
                  { label: 'GDG Community', value: 'GDG Community' },
                  { label: 'Friend/Colleague', value: 'Friend/Colleague' },
                  { label: 'Others', value: 'Others' },
                ]}
              />

              {error && (
                <p className="text-sm text-center" style={{ color: '#EF4444' }}>{error}</p>
              )}

              <Button
                type="submit"
                className="rounded-lg w-full space-x-2.5 mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Register Now</span>
                    <ArrowUpRight className="text-white" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
