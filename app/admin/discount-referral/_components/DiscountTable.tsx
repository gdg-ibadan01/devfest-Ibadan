'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import type { DiscountRecord, DiscountStatus } from '../_types/discount.types';
import DiscountActionsMenu from './DiscountActionsMenu';

/* ------------------------------------------------------------------ */
/* Mock data                                                            */
/* ------------------------------------------------------------------ */
const MOCK_DISCOUNTS: DiscountRecord[] = [
  {
    id: '1',
    discountId: 'DevFest1029',
    type: 'percentage',
    value: '10%',
    usage: '34/1000',
    validity: '15th Mar - 23rd Oct',
    status: 'Active',
  },
  {
    id: '2',
    discountId: 'DevFest1029',
    type: 'fixed',
    value: '₦1000',
    usage: '0/12',
    validity: '15th Mar - 23rd Oct',
    status: 'Active',
  },
  {
    id: '3',
    discountId: 'DevFest1029',
    type: 'percentage',
    value: '10%',
    usage: '33/4000',
    validity: '15th Mar - 23rd Oct',
    status: 'Expired',
  },
  {
    id: '4',
    discountId: 'DevFest1029',
    type: 'percentage',
    value: '10%',
    usage: '1000/1000',
    validity: '15th Mar - 23rd Oct',
    status: 'Scheduled',
  },
  {
    id: '5',
    discountId: 'DevFest1029',
    type: 'percentage',
    value: '₦1000',
    usage: '12/1000',
    validity: '15th Mar - 23rd Oct',
    status: 'Active',
  },
];

/* ------------------------------------------------------------------ */
/* Status badge config                                                  */
/* ------------------------------------------------------------------ */
const statusConfig: Record<
  DiscountStatus,
  { dot: string; text: string; bg: string }
> = {
  Active: {
    dot: 'bg-[#34A853]',
    text: 'text-[#1B873B]',
    bg: 'bg-[#E8F5E9]',
  },
  Expired: {
    dot: 'bg-[#6B7280]',
    text: 'text-[#374151]',
    bg: 'bg-[#F3F4F6]',
  },
  Scheduled: {
    dot: 'bg-[#F59E0B]',
    text: 'text-[#92400E]',
    bg: 'bg-[#FEF3C7]',
  },
};

/* ------------------------------------------------------------------ */
/* Type label helper                                                    */
/* ------------------------------------------------------------------ */
function typeLabel(type: DiscountRecord['type']) {
  return type === 'percentage' ? 'Percentage (%)' : 'Fixed (₦)';
}

/* ------------------------------------------------------------------ */
/* Empty state illustration                                             */
/* ------------------------------------------------------------------ */
function EmptyState() {
  return (
    <tr>
      <td colSpan={8} className="py-20">
        <div className="flex flex-col items-center gap-3">
          {/* Simple SVG illustration */}
          <div className="w-[120px] h-[120px] flex items-center justify-center border border-gray-200 rounded-2xl bg-white">
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Stack of papers */}
              <rect x="10" y="18" width="40" height="36" rx="3" fill="#E5E7EB" />
              <rect x="14" y="14" width="40" height="36" rx="3" fill="#F3F4F6" />
              <rect x="18" y="10" width="40" height="36" rx="3" fill="#fff" stroke="#D1D5DB" strokeWidth="1.5" />
              <line x1="26" y1="22" x2="50" y2="22" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="26" y1="28" x2="50" y2="28" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="26" y1="34" x2="40" y2="34" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
              {/* Magnifying glass */}
              <circle cx="50" cy="46" r="12" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="1.5" />
              <circle cx="50" cy="46" r="7" fill="#fff" stroke="#D1D5DB" strokeWidth="1.5" />
              <line x1="55" y1="53" x2="61" y2="59" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-[14px] font-semibold text-gray-700">No Data</p>
            <p className="text-[12px] text-gray-400 mt-1">
              There is no data to
              <br />
              show you right now
            </p>
          </div>
        </div>
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/* Table                                                               */
/* ------------------------------------------------------------------ */
const COLUMNS = [
  { key: 'check', label: '' },
  { key: 'id', label: 'Discount ID' },
  { key: 'type', label: 'Type' },
  { key: 'value', label: 'Value' },
  { key: 'usage', label: 'Usage' },
  { key: 'validity', label: 'Validity' },
  { key: 'status', label: 'Status' },
  { key: 'action', label: 'Action' },
];

interface DiscountTableProps {
  onCreateClick: () => void;
  onEditClick: (record: DiscountRecord) => void;
  onDeleteClick: (record: DiscountRecord) => void;
}

export default function DiscountTable({
  onCreateClick,
  onEditClick,
  onDeleteClick,
}: DiscountTableProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = MOCK_DISCOUNTS.filter((d) =>
    d.discountId.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const hasData = filtered.length > 0;

  return (
    <>
      {/* Search + Actions bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center flex-1 max-w-[480px] border border-gray-200 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black/10">
          <Search size={15} className="ml-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for ticket"
            className="flex-1 px-3 py-[11px] text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
        </div>

        <button className="px-5 py-[11px] bg-gray-900 text-white text-[13px] font-medium rounded-md hover:bg-black transition-colors">
          Search
        </button>

        <div className="ml-auto">
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-5 py-[11px] bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-black transition-colors"
          >
            Create Discount
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'text-left px-5 py-4 text-[12px] font-medium text-gray-500 whitespace-nowrap',
                    col.key === 'check' && 'w-10 pr-0'
                  )}
                >
                  {col.key === 'check' ? (
                    <span />
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!hasData ? (
              <EmptyState />
            ) : (
              filtered.map((record) => {
                const badge = statusConfig[record.status];
                const isChecked = selected.has(record.id);

                return (
                  <tr
                    key={record.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Checkbox */}
                    <td className="px-5 py-4 w-10 pr-0">
                      <button
                        type="button"
                        onClick={() => toggleSelect(record.id)}
                        className={cn(
                          'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                          isChecked
                            ? 'bg-gray-900 border-gray-900'
                            : 'border-gray-300 bg-white hover:border-gray-500'
                        )}
                      >
                        {isChecked && (
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path
                              d="M1 4L3 6L7 2"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    </td>

                    <td className="px-5 py-4 text-[13px] text-gray-800 font-medium">
                      {record.discountId}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-600">
                      {typeLabel(record.type)}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-700">
                      {record.value}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-600">
                      {record.usage}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-600">
                      {record.validity}
                    </td>

                    {/* Status badge */}
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-[5px] px-3 py-[4px] rounded-full text-[11px] font-medium',
                          badge.bg,
                          badge.text
                        )}
                      >
                        <span
                          className={cn(
                            'w-[6px] h-[6px] rounded-full flex-shrink-0',
                            badge.dot
                          )}
                        />
                        {record.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <DiscountActionsMenu
                        onEdit={() => onEditClick(record)}
                        onDelete={() => onDeleteClick(record)}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
