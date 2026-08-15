'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import type { AuditLogRecord } from '../_types/audit-log.types';

/* ------------------------------------------------------------------ */
/* Mock data                                                            */
/* ------------------------------------------------------------------ */
const MOCK_LOGS: AuditLogRecord[] = [
  { id: '1', logId: 'LOG-2048600091', team: 'Mary Esivue', role: 'Super Admin', action: 'Created Attendee', time: '10:24:28', date: '15th March, 2025' },
  { id: '2', logId: 'LOG-2048600091', team: 'Mary Esivue', role: 'Super Admin', action: 'Created referral', time: '10:24:28', date: '15th March, 2025' },
  { id: '3', logId: 'LOG-2048600091', team: 'Mary Esivue', role: 'Super Admin', action: 'Created referral', time: '10:24:28', date: '15th March, 2025' },
  { id: '4', logId: 'LOG-2048600091', team: 'Mary Esivue', role: 'Super Admin', action: 'Created referral', time: '10:24:28', date: '15th March, 2025' },
  { id: '5', logId: 'LOG-2048600091', team: 'Mary Esivue', role: 'Super Admin', action: 'Created referral', time: '10:24:28', date: '15th March, 2025' },
];

/* ------------------------------------------------------------------ */
/* Empty state                                                          */
/* ------------------------------------------------------------------ */
function EmptyState() {
  return (
    <tr>
      <td colSpan={6} className="py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-[120px] h-[120px] flex items-center justify-center border border-gray-200 rounded-2xl bg-white">
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <rect x="10" y="18" width="40" height="36" rx="3" fill="#E5E7EB" />
              <rect x="14" y="14" width="40" height="36" rx="3" fill="#F3F4F6" />
              <rect x="18" y="10" width="40" height="36" rx="3" fill="#fff" stroke="#D1D5DB" strokeWidth="1.5" />
              <line x1="26" y1="22" x2="50" y2="22" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="26" y1="28" x2="50" y2="28" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="26" y1="34" x2="40" y2="34" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="50" cy="46" r="12" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="1.5" />
              <circle cx="50" cy="46" r="7" fill="#fff" stroke="#9CA3AF" strokeWidth="1.5" />
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
const COLUMNS = ['Log ID', 'Team', 'Role', 'Action', 'Time', 'Date'];

export default function AuditLogTable() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  const filtered = MOCK_LOGS.filter(
    (log) =>
      log.logId.toLowerCase().includes(query.toLowerCase()) ||
      log.team.toLowerCase().includes(query.toLowerCase()) ||
      log.action.toLowerCase().includes(query.toLowerCase()) ||
      log.role.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = () => setQuery(search);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <>
      {/* Search bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center flex-1 max-w-[480px] border border-gray-200 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black/10">
          <Search size={15} className="ml-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for action"
            className="flex-1 px-3 py-[11px] text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-5 py-[11px] bg-gray-900 text-white text-[13px] font-medium rounded-md hover:bg-black transition-colors"
        >
          Search
        </button>
      </div>

      {/* Table card */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-white">
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="px-5 py-4 text-left text-[13px] font-medium text-gray-500 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              filtered.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4 text-[13px] text-gray-800 whitespace-nowrap">
                    {log.logId}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-gray-800 whitespace-nowrap">
                    {log.team}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-gray-800 whitespace-nowrap">
                    {log.role}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-gray-800 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-gray-600 whitespace-nowrap">
                    {log.time}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-gray-600 whitespace-nowrap">
                    {log.date}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
