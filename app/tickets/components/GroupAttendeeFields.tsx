import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import type { BuyerDetailsFieldsProps } from './BuyerDetailsFields';

interface GroupAttendeeFieldsProps extends Omit<
  BuyerDetailsFieldsProps,
  'isGift'
> {
  attendeeEmails: string[];
  onAttendeeEmailsChange: (emails: string[]) => void;
  isSaved: boolean;
  onSave: () => void;
}

const inputClassName =
  'h-48 w-full min-w-0 rounded-[8px] border border-[#E2DFD8] bg-white px-16 font-inter text-[14px] font-normal text-[#111] placeholder:text-[#7F8082] outline-none focus:border-core-blue';
const labelClassName =
  'flex min-w-0 flex-col gap-8 font-inter text-[13px] font-semibold text-[#111]';

export default function GroupAttendeeFields({
  fullName,
  setFullName,
  email,
  setEmail,
  attendeeEmails,
  onAttendeeEmailsChange,
  isSaved,
  onSave,
}: Readonly<GroupAttendeeFieldsProps>) {
  return (
    <section aria-label="Group attendees" className="flex flex-col gap-24">
      <Image
        src="/tickets/group-divider.svg"
        alt=""
        width={684}
        height={1}
        className="h-auto w-full"
      />
      <fieldset className="min-w-0">
        <legend className="mb-12 font-grotesk text-[16px] font-semibold text-core-blue">
          Attendee 1 (Group Lead)
        </legend>
        <div className="grid grid-cols-1 gap-20 sm:grid-cols-2">
          <label className={labelClassName} htmlFor="groupLeadName">
            Full Name *
            <input
              id="groupLeadName"
              autoComplete="name"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Enter full name"
              className={inputClassName}
            />
          </label>
          <label className={labelClassName} htmlFor="groupLeadEmail">
            Email Address *
            <input
              id="groupLeadEmail"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter email address"
              className={inputClassName}
            />
          </label>
        </div>
      </fieldset>
      {attendeeEmails.map((attendeeEmail, index) => (
        <div key={index} className="relative flex flex-col gap-12">
          <h2 className="font-grotesk text-[16px] font-semibold text-[#111]">
            Attendee {index + 2}
          </h2>
          <div className="absolute -top-1 right-0 flex items-center gap-8">
            {attendeeEmails.length > 1 && (
              <button
                type="button"
                aria-label={`Delete attendee ${index + 2}`}
                onClick={() => {
                  if (attendeeEmails.length > 1) {
                    onAttendeeEmailsChange(
                      attendeeEmails.filter(
                        (_, attendeeIndex) => attendeeIndex !== index
                      )
                    );
                  }
                }}
                className="flex h-36 w-36 items-center justify-center rounded-full text-red-600 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
              >
                <Trash2 className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
            {index === 0 && (
              <button
                type="button"
                aria-label="Add attendee"
                onClick={() => onAttendeeEmailsChange([...attendeeEmails, ''])}
                className="flex h-36 w-36 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-core-blue"
              >
                <Image
                  src="/tickets/add-attendee.svg"
                  alt=""
                  width={27}
                  height={27}
                />
              </button>
            )}
          </div>
          <label
            className={labelClassName}
            htmlFor={`groupAttendeeEmail-${index}`}
          >
            Email Address *
            <input
              id={`groupAttendeeEmail-${index}`}
              type="email"
              required
              value={attendeeEmail}
              onChange={(event) =>
                onAttendeeEmailsChange(
                  attendeeEmails.map((value, attendeeIndex) =>
                    attendeeIndex === index ? event.target.value : value
                  )
                )
              }
              placeholder="Enter email address"
              className={inputClassName}
            />
          </label>
        </div>
      ))}
      <div className="flex items-center justify-end gap-16">
        <span role="status" className="text-[14px] text-gray-500">
          {isSaved ? 'Attendee details saved' : ''}
        </span>
        <button
          type="button"
          onClick={(event) => {
            if (event.currentTarget.form?.reportValidity()) onSave();
          }}
          className="text-[24px] font-medium text-core-blue hover:underline focus-visible:outline-core-blue"
        >
          Save
        </button>
      </div>
    </section>
  );
}
