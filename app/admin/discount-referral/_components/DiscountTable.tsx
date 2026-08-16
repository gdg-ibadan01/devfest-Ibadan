'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import type { DiscountRecord, DiscountStatus } from '../_types/discount.types';
import DiscountActionsMenu from './DiscountActionsMenu';
import EmptyState from '@/app/_module/components/common/EmptyState';
import MOCK_DISCOUNTS from './MockData';

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

function typeLabel(type: DiscountRecord['type']) {
  return type === 'percentage' ? 'Percentage (%)' : 'Fixed (₦)';
}

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
      <div className="flex flex-wrap items-center gap-3 gap-y-2 mb-6">
        <div className="flex items-center w-full sm:flex-1 sm:max-w-[480px] border border-gray-200 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black/10">
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

        <div className="sm:ml-auto w-full sm:w-auto">
          <button
            onClick={onCreateClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-[11px] bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-black transition-colors"
          >
            Create Discount
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'text-left px-5 py-4 text-[12px] font-semibold text-[#121212] whitespace-nowrap',
                    col.key === 'check' && 'w-10 pr-0'
                  )}
                >
                  {col.key === 'check' ? <span /> : col.label}
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
                          <svg
                            width="8"
                            height="8"
                            viewBox="0 0 8 8"
                            fill="none"
                          >
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
                          'flex items-center gap-[2px] px-3 py-[3px] rounded-[30px] w-fit text-[11px] font-medium',
                          badge.bg,
                          badge.text
                        )}
                      >
                        <span
                          className={cn(
                            'w-[8px] h-[8px] rounded-[1.3px]',
                            badge.dot
                          )}
                        />
                        <span
                          className={cn(
                            'w-[6px] h-[6px] rounded-full flex-shrink-0'
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
      </div>
    </>
  );
}
