export interface BuyerDetailsFieldsProps {
  fullName: string;
  setFullName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  isGift: boolean;
}

export default function BuyerDetailsFields({
  fullName,
  setFullName,
  email,
  setEmail,
  isGift,
}: Readonly<BuyerDetailsFieldsProps>) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="fullName"
          className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium"
        >
          {isGift ? (
            <>
              Your Full Name{' '}
              <span className="text-gray-400 font-normal">(Sender)</span>
            </>
          ) : (
            'Full Name'
          )}
        </label>
        <input
          type="text"
          id="fullName"
          placeholder="Enter Full Name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-gray-200 rounded-[8px] px-4 py-3 md:py-3.5 text-[14px] md:text-[16px] placeholder-gray-400 outline-none focus:border-[#4285F4] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium"
        >
          {isGift ? (
            <>
              Your Email Address{' '}
              <span className="text-gray-400 font-normal">(Sender)</span>
            </>
          ) : (
            'Email Address'
          )}
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-200 rounded-[8px] px-4 py-3 md:py-3.5 text-[14px] md:text-[16px] placeholder-gray-400 outline-none focus:border-[#4285F4] transition-colors"
        />
      </div>
    </>
  );
}
