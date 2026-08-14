'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Calendar, Plus } from 'lucide-react';
import TicketActionsMenu from './TicketActionsMenu';
import TicketPreviewModal from './TicketPreviewModal';
import type { TicketRecord, TicketFormData } from '../_types/ticket.types';

const MOCK_TICKETS: TicketRecord[] = [
  {
    id: '1',
    name: 'Kebbi',
    declarationDates: [
      { label: 'Fri(09/07/2026)', day: 'fri' },
      { label: 'Sat(10/07/2026)', day: 'sat' },
    ],
    price: '₦3,200',
    discount: '₦3,200',
    startDate: '9th March, 2025',
    endDate: '10th March, 2025',
    quantity: 300,
  },
];

const MOCK_PREVIEW_DATA: TicketFormData = {
  basicInfo: {
    name: 'DevFest 2026',
    description:
      'Kick off DevFest with a full day of hands-on workshops. Build, break, and learn alongside fellow developers before the main event',
    declarationDate: 'both',
  },
  pricing: {
    price: '3200',
    discount: '320',
    earlyBird: true,
  },
  advancedSettings: {
    validity: 'both',
    quantityLimit: '4000',
    startDate: '2026-09-12',
    endDate: '2026-09-12',
  },
};

const COLUMNS = [
  'Ticket Name',
  'Ticketing declaration dates',
  'Price',
  'Discount',
  'Start Date',
  'End Date',
  'Quantity',
  'Action',
];

export default function TicketTable() {
  const [search, setSearch] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<TicketFormData>(MOCK_PREVIEW_DATA);

  const handlePreview = (ticket: TicketRecord) => {
    setPreviewData(MOCK_PREVIEW_DATA);
    setPreviewOpen(true);
  };

  const filtered = MOCK_TICKETS.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Search + filters bar */}
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

        <button className="px-5 py-[11px] bg-black text-white text-[13px] font-medium rounded-md hover:bg-gray-900 transition-colors">
          Search
        </button>

        <div className="ml-auto">
          <Link href="/admin/ticket/create">
            <button className="px-5 py-[11px] border border-gray-200 text-[13px] font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Plus size={20} /> Create Ticket
            </button>
          </Link>
        </div>

        <button className="flex items-center gap-2 px-4 py-[11px] border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
          Date
          <Calendar size={14} className="text-gray-400" />
        </button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-white">
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="text-left px-5 py-4 text-[12px] font-semibold text-gray-700 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="text-center py-16 text-[13px] text-gray-400"
                >
                  No tickets found
                </td>
              </tr>
            ) : (
              filtered.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4 text-[13px] text-gray-800 font-medium">
                    {ticket.name}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {ticket.declarationDates.map((d) => (
                        <span
                          key={d.day}
                          className="px-2 py-1 rounded-sm border text-[12px] text-gray-600 bg-[#F3F3F3] whitespace-nowrap"
                        >
                          {d.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-gray-700">
                    {ticket.price}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-gray-700">
                    {ticket.discount}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-gray-600">
                    {ticket.startDate}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-gray-600">
                    {ticket.endDate}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-gray-700">
                    {ticket.quantity}
                  </td>
                  <td className="px-5 py-4">
                    <TicketActionsMenu
                      onPreview={() => handlePreview(ticket)}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TicketPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={previewData}
      />
    </>
  );
}
