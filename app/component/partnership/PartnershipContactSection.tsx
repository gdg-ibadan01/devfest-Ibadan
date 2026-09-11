'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { PartnershipContactCard } from './PartnershipContactCard';
import { WhatsAppIcon } from './WhatsAppIcon';
import {
  PARTNERSHIP_CONTACTS,
  PARTNERSHIP_MAILTO_ALL,
  PARTNERSHIP_WHATSAPP_LINK,
} from './data';

export const PartnershipContactSection: FC = () => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopy = (email: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      toast.success(`Copied ${email} to clipboard!`);
      setTimeout(() => setCopiedEmail(null), 2500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full max-w-xl mx-auto lg:mx-0 flex flex-col justify-between"
    >
      <div className="border border-black rounded-3xl p-6 sm:p-8 md:p-[32px] bg-white shadow-sm flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs sm:text-sm font-mono font-bold tracking-widest text-black uppercase">
              GET IN TOUCH WITH OUR TEAM
            </h3>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-xl bg-[#E2DFD8]/60 text-black">
              DIRECT CONTACT
            </span>
          </div>

          <p className="text-sm text-[#4B5563] leading-relaxed mb-6">
            Have questions about sponsorship packages, bespoke activations, or
            partnership deliverables? Reach out directly to our partnership
            team:
          </p>

          {/* The Two Email Contact Cards */}
          <div className="space-y-4">
            {PARTNERSHIP_CONTACTS.map((contact) => (
              <PartnershipContactCard
                key={contact.email}
                contact={contact}
                isCopied={copiedEmail === contact.email}
                onCopy={handleCopy}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-[#E2DFD8] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href={PARTNERSHIP_MAILTO_ALL}
            className="group relative inline-flex p-[2px] rounded-[100px] overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg flex-1"
          >
            {/* Google Multi-Color Gradient Ring */}
            <span className="absolute inset-0 bg-gradient-to-r from-[#34A853] via-[#FBBC04] to-[#4285F4] rounded-[100px] transition-opacity group-hover:opacity-90" />
            {/* Inner Button */}
            <span className="relative w-full px-6 py-3.5 rounded-[100px] bg-[#18181b] group-hover:bg-[#232326] text-white text-sm sm:text-base font-semibold tracking-wide transition-colors flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Email Partnership Team</span>
            </span>
          </Link>

          <a
            href={PARTNERSHIP_WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center px-5 py-3 rounded-[100px] border border-[#25D366] bg-white hover:bg-[#25D366]/10 text-[#25D366] text-sm font-semibold transition-colors gap-2"
          >
            <WhatsAppIcon className="w-4 h-4 fill-[#25D366] shrink-0" />
            <span>WhatsApp</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#25D366] opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};
