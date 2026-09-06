'use client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface FooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

const columnOneLinks: FooterLink[] = [
  { label: 'Sponsors', href: '/sponsors' },
  { label: 'Schedule', href: '/schedule' },
  { label: 'Speakers', href: '/speakers' },
  { label: 'Merch', href: 'https://selar.co/m/gdg-ibadan1', isExternal: true },
];

const columnTwoLinks: FooterLink[] = [
  {
    label: 'Apply to Speak',
    href: 'https://sessionize.com/devfest-ibadan-2025/',
    isExternal: true,
  },
  {
    label: 'Apply to be a volunteer',
    href: 'https://gdg.community.dev/events/details/google-gdg-ibadan-presents-devfest-ibadan-2026/',
    isExternal: true,
  },
  {
    label: 'Apply to be a Sponsor',
    href: "https://wa.me/2348136023230?text=I'm%20ready%20to%20power%20the%20future%20of%20tech%20at%20DevFest%20Ibadan%202025.%20I%20would%20like%20to%20inquire%20about%20sponsorship%20opportunities%21%20Let's%20connect%20to%20build%20something%20great.",
    isExternal: true,
  },
];

const columnThreeLinks: FooterLink[] = [
  {
    label: 'Join our Community',
    href: 'https://gdg.community.dev/gdg-ibadan/',
    isExternal: true,
  },
  {
    label: 'Contact Us',
    href: 'mailto:ibadangdg@gmail.com',
    isExternal: true,
  },
];

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/gdg-ibadan',
    colorClass: 'text-[#4285F4] decoration-[#4285F4]',
  },
  {
    label: 'Twitter (x)',
    href: 'https://x.com/gdgibadan',
    colorClass: 'text-[#FBBC04] decoration-[#FBBC04]',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/gdgibadan',
    colorClass: 'text-[#EA4335] decoration-[#EA4335]',
  },
];

export const DFIFooterV2: FC = () => {
  const pathname = usePathname();

  const renderLink = (item: FooterLink) => {
    const isActive =
      !item.isExternal &&
      Boolean(
        pathname &&
          (pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href)))
      );

    const content = (
      <span
        className={`text-sm sm:text-[15px] font-normal transition-colors ${
          isActive
            ? 'text-[#4285F4] underline decoration-[#4285F4] underline-offset-4'
            : 'text-[#9CA3AF] hover:text-white hover:underline hover:decoration-[#4285F4]/70 hover:underline-offset-4'
        }`}
      >
        {item.label}
      </span>
    );

    if (item.isExternal) {
      return (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-fit"
        >
          {content}
        </a>
      );
    }

    return (
      <Link key={item.label} href={item.href} className="block w-fit">
        {content}
      </Link>
    );
  };

  return (
    <footer className="w-full bg-[#0A0A0A] text-white">
      <div className="w-full md:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-24 py-56 space-y-[40px] md:gap-0">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-[48px] lg:gap-16">
          {/* Left: Logos */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 shrink-0">
            <Link
              href="/"
              className="inline-block transition-opacity hover:opacity-90"
            >
              <Image
                src="/devfest_logo.svg"
                alt="DevFest Ibadan 2026"
                width={269}
                height={77}
                className="h-10 sm:h-12 md:h-14 w-auto object-contain"
                priority
              />
            </Link>
            <a
              href="https://gdg.community.dev/gdg-ibadan/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-opacity hover:opacity-90"
            >
              <Image
                src="/gdg_logo.svg"
                alt="Google Developer Groups"
                width={239}
                height={78}
                className="h-10 sm:h-12 md:h-14 w-auto object-contain"
                priority
              />
            </a>
          </div>

          {/* Right: Navigation Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 md:gap-16 lg:gap-20">
            <div className="flex flex-col space-y-4">
              {columnOneLinks.map(renderLink)}
            </div>
            <div className="flex flex-col space-y-4">
              {columnTwoLinks.map(renderLink)}
            </div>
            <div className="flex flex-col space-y-4 col-span-2 sm:col-span-1">
              {columnThreeLinks.map(renderLink)}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 sm:mt-24 lg:mt-32 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          {/* Social Links */}
          <div>
            <p className="font-mono text-[11px] font-bold tracking-widest text-[#71717A] uppercase mb-2">
              FOLLOW US ON:
            </p>
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 lg:gap-24 font-mono text-xs sm:text-sm font-medium">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.colorClass} underline underline-offset-4 hover:opacity-80 transition-opacity`}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div>
            <p className="font-mono text-xs sm:text-sm text-[#71717A]">
              © {new Date().getFullYear()} Google Developer Group Ibadan.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DFIFooterV2;
