'use client';

import { FC } from 'react';
import { Mail, Copy, Check, ArrowUpRight } from 'lucide-react';
import { PartnerContact } from './types';

interface PartnershipContactCardProps {
  contact: PartnerContact;
  isCopied: boolean;
  onCopy: (email: string) => void;
}

export const PartnershipContactCard: FC<PartnershipContactCardProps> = ({
  contact,
  isCopied,
  onCopy,
}) => {
  const mailtoLink = `mailto:${contact.email}?subject=DevFest%20Ibadan%202026%20Partnership%20Inquiry`;

  return (
    <div className="group border border-black/80 rounded-2xl p-4 sm:p-5 bg-[#FAFAFA] hover:bg-white transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: contact.accentColor }}
          />
          <h4 className="font-mono font-bold text-base text-black">
            {contact.name}
          </h4>
        </div>

        <span
          className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-xl uppercase"
          style={{
            backgroundColor: contact.badgeBg,
            color: '#111111',
          }}
        >
          {contact.role}
        </span>
      </div>

      {/* Email row with clickable mailto and copy button */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-black/10">
        <a
          href={mailtoLink}
          className="font-mono text-xs sm:text-sm text-black hover:text-[#4285F4] transition-colors flex items-center gap-1.5 truncate font-medium"
          title={`Email ${contact.name}`}
        >
          <Mail className="w-3.5 h-3.5 shrink-0 text-[#4B5563]" />
          <span className="truncate">{contact.email}</span>
          <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>

        <button
          type="button"
          onClick={() => onCopy(contact.email)}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-lg border border-black/20 bg-white hover:bg-black hover:text-white transition-colors shrink-0"
          aria-label={`Copy ${contact.email}`}
        >
          {isCopied ? (
            <>
              <Check className="w-3 h-3 text-[#34A853]" />
              <span className="font-semibold text-[#34A853]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
