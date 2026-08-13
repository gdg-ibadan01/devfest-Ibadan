import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { CustomInput } from '../_module/components/ui/input';
import { CustomSelect } from '../_module/components/ui/select';
import { Button } from '../_module/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

export default function Rsvp() {
  return (
    <main
      className="md:pt-[100px] pt-[80px] bg-halftone-blue mains min-h-screen"
      //  style={{
      //       backgroundImage: isTablet
      //         ? "url('/ticket_bg.png')"
      //         : "url('/ticket_mobile_bg.png')",
      //       backgroundRepeat: 'no-repeat',
      //       backgroundPosition: 'center',
      //       backgroundSize: 'cover',
      //     }}
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
            <h1 className="font-bold text-lg">Attendee Registration</h1>
            <p className="text-sm text-[#666666]">
              Please fill out your details to reserve your ticket.
            </p>
          </div>
          <div className="space-y-4">
            <CustomInput label="Full Name" placeholder="Enter your full name" />
            <CustomInput label="Email Address" placeholder="you@example.com" />
            <CustomInput label="Phone Number" placeholder="+234_ _ _ _ _ _" />
            <CustomSelect
              label="Gender"
              placeholder="Select Gender"
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
              ]}
            />
            <CustomInput
              label="Job Title / Role"
              placeholder="e.g. Frontend Developer, Designer"
            />
            <Button className="rounded-lg w-full space-x-2.5 mt-4">
              <span>Register Now</span>
              <ArrowUpRight className="text-white" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
