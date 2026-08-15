'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import type { AuditLogRecord } from '../_types/audit-log.types';
import EmptyState from '@/app/_module/components/common/EmptyState';
import MOCK_LOGS from './MockData';


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
        <div className="flex items-center flex-1 max-w-[480px] border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black/10">
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
                  className="px-5 py-4 text-left text-[13px] font-semibold text-[#121212] whitespace-nowrap"
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
