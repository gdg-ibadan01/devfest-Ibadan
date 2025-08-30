import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface CheckOutProps {
  formData: {
    fullName: string;
    phoneNumber: string;
    jobTitle?: string;
    email: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      fullName: string;
      phoneNumber: string;
      jobTitle: string;
      email: string;
    }>
  >;
  setView: React.Dispatch<React.SetStateAction<string>>;
}

const CheckOut: React.FC<CheckOutProps> = ({
  formData,
  setFormData,
  setView,
}) => {
  const router = useRouter();
  return (
    <form
      className="bg-white px-4 md:px-28 py-28 rounded-2xl flex flex-col gap-5 border md:border-none"
      onSubmit={(e) => {
        e.preventDefault();
        setView('summary');
      }}
    >
      <button
        className="w-fit flex flex-col md:flex-row justify-center items-start md:items-center gap-3 text-gray-600"
        onClick={() => router.back()}
      >
        <ArrowLeft />
        <p className="font-bold text-xl md:text-2xl">Registration</p>
      </button>

      <div className="flex flex-col md:flex-row justify-center gap-3">
        <div className="w-full md:w-1/2 flex flex-col gap-1">
          <label
            htmlFor="fullName"
            className="text-gray-600 text-sm md:text-base"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            placeholder="Enter Full Name"
            required
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fullName: e.target.value }))
            }
            className="border border-gray-200 px-4 py-2 rounded-md outline-none text-gray-400 text-sm md:text-base"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-1">
          <label htmlFor="email" className="text-gray-600 text-sm md:text-base">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            required
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="border border-gray-200 px-4 py-2 rounded-md outline-none text-gray-400 text-sm md:text-base"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center gap-3">
        <div className="w-full md:w-1/2 flex flex-col gap-1">
          <label
            htmlFor="phoneNumber"
            className="text-gray-600 text-sm md:text-base"
          >
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            placeholder="e.g +23359605494"
            required
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))
            }
            className="border border-gray-200 px-4 py-2 rounded-md outline-none text-gray-400 text-sm md:text-base"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-1">
          <label
            htmlFor="jobTitle"
            className="text-gray-600 text-sm md:text-base"
          >
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            required
            placeholder="Enter job title"
            value={formData.jobTitle}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))
            }
            className="border border-gray-200 px-4 py-2 rounded-md outline-none text-gray-400 text-sm md:text-base"
          />
        </div>
      </div>

      <button className="bg-[#1E1E1E] py-3 md:py-4 text-white hover:bg-core-blue rounded-[100px] flex gap-2 justify-center transition-colors duration-500 mt-6">
        Get Ticket <ArrowUpRight />
      </button>
    </form>
  );
};

export default CheckOut;
