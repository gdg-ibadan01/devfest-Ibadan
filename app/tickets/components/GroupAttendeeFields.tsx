import Image from 'next/image';
import type { BuyerDetailsFieldsProps } from './BuyerDetailsFields';

export interface GroupMember {
  fullName: string;
  email: string;
}

export interface GroupAttendeeFieldsProps extends Omit<
  BuyerDetailsFieldsProps,
  'isGift'
> {
  groupMembers: GroupMember[];
  onGroupMembersChange: (members: GroupMember[]) => void;
  maxAttendees?: number;
  isSaved?: boolean;
  onSave?: () => void;
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
  groupMembers,
  onGroupMembersChange,
  maxAttendees,
  isSaved,
  onSave,
}: Readonly<GroupAttendeeFieldsProps>) {
  const canAddMore = !maxAttendees || groupMembers.length + 1 < maxAttendees;

  const handleUpdateMember = (
    index: number,
    field: keyof GroupMember,
    value: string
  ) => {
    onGroupMembersChange(
      groupMembers.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    );
  };

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
            Full Name *{' '}
            <input
              id="groupLeadName"
              autoComplete="name"
              required
              minLength={3}
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Enter full name"
              className={inputClassName}
            />
          </label>
          <label className={labelClassName} htmlFor="groupLeadEmail">
            Email Address *{' '}
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

      {groupMembers.map((member, index) => (
        <fieldset key={index} className="relative min-w-0 flex flex-col gap-12">
          <div className="flex items-center justify-between">
            <legend className="font-grotesk text-[16px] font-semibold text-[#111]">
              Attendee {index + 2}
            </legend>
            <div className="flex items-center gap-8">
              {index === 0 && canAddMore && (
                <button
                  type="button"
                  aria-label="Add attendee"
                  onClick={() =>
                    onGroupMembersChange([
                      ...groupMembers,
                      { fullName: '', email: '' },
                    ])
                  }
                  className="flex h-36 w-36 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-core-blue cursor-pointer hover:opacity-80 transition-opacity"
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
          </div>
          <div className="grid grid-cols-1 gap-20 sm:grid-cols-2">
            <label
              className={labelClassName}
              htmlFor={`groupMemberName-${index}`}
            >
              Full Name *{' '}
              <input
                id={`groupMemberName-${index}`}
                autoComplete="name"
                required
                minLength={3}
                value={member.fullName}
                onChange={(event) =>
                  handleUpdateMember(index, 'fullName', event.target.value)
                }
                placeholder="Enter full name"
                className={inputClassName}
              />
            </label>
            <label
              className={labelClassName}
              htmlFor={`groupMemberEmail-${index}`}
            >
              Email Address *{' '}
              <input
                id={`groupMemberEmail-${index}`}
                type="email"
                autoComplete="email"
                required
                value={member.email}
                onChange={(event) =>
                  handleUpdateMember(index, 'email', event.target.value)
                }
                placeholder="Enter email address"
                className={inputClassName}
              />
            </label>
          </div>
        </fieldset>
      ))}

      {onSave && (
        <div className="flex items-center justify-end gap-16">
          <span role="status" className="text-[14px] text-gray-500">
            {isSaved ? 'Attendee details saved' : ''}
          </span>
          <button
            type="button"
            onClick={(event) => {
              if (event.currentTarget.form?.reportValidity()) onSave();
            }}
            className="text-[20px] font-medium text-core-blue hover:underline focus-visible:outline-core-blue cursor-pointer"
          >
            Save
          </button>
        </div>
      )}
    </section>
  );
}
