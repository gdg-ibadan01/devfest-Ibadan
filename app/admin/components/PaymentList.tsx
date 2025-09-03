'use client';

import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { Payment } from '@/types/services';
import { useCheckInAttendee } from '@/hooks/useAdminAuth';
import { PageLoader } from '@/app/layouts';

interface PaymentsListProps {
  payments: Payment[];
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  paginationInfo: {
    hasNextPage: boolean;
    hasPrevPage: boolean;
    dataLength?: number;
  };
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const columnHelper = createColumnHelper<Payment>();

const PaymentsList: React.FC<PaymentsListProps> = ({
  payments,
  isLoading,
  currentPage,
  pageSize,
  paginationInfo,
  onPageChange,
  onPageSizeChange
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const checkInMutation = useCheckInAttendee();

  // Use server-side pagination - display current page data as-is (already filtered client-side)
  const displayData = payments;

  const handleCheckIn = async (ticketNumber: string) => {
    try {
      await checkInMutation.mutateAsync(ticketNumber);
    } catch (error) {
      console.error('Check-in failed:', error);
    }
  };

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => <div className=" text-sm">{info.getValue()}</div>,
    }),
    columnHelper.accessor('tickets.ticketNumber', {
      header: 'Ticket ID',
      cell: (info) => <div className=" text-sm">{info.row.original.tickets?.[0]?.ticketNumber}</div>,
    }),
    columnHelper.accessor('attendee.fullName', {
      header: 'Name',
      cell: (info) => <div className=" text-sm">{info.getValue()}</div>,
    }),
    columnHelper.accessor('attendee.email', {
      header: 'Email',
      cell: (info) => <div className=" text-sm">{info.getValue()}</div>,
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: (info) => (
        <div className="font-medium text-sm">
          {info.row.original.currency}{' '}
          {parseFloat(info.getValue()).toLocaleString()}
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue();
        const statusStyles = {
          SUCCESS: 'text-core-green',
          PENDING: 'text-core-yellow',
          FAILED: 'text-core-red',
        };
        return (
          <span
            className={`inline-block text-md font-bold ${statusStyles[status]}`}
          >
            {status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase()}
          </span>
        );
      },
    }),
    columnHelper.accessor('paymentReference', {
      header: 'Payment Reference',
      cell: (info) => (
        <div className="text-sm font-mono">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor('paymentMethod', {
      header: 'Payment Method',
      cell: (info) => (
        <div className="capitalize  text-sm">
          {info.getValue().replace('_', ' ')}
        </div>
      ),
    }),
    columnHelper.accessor('paidAt', {
      header: 'Paid At',
      cell: (info) => {
        const paidAt = info.getValue();
        return (
          <div className=" text-sm">
            {paidAt ? new Date(paidAt).toLocaleDateString() : 'N/A'}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'checkedIn',
      header: 'Checked-In',
      cell: (info) => {
        const isCheckedIn = info.row.original.tickets?.[0]?.isCheckedIn;
        return (
          <span
            className={`font-medium ${isCheckedIn ? 'text-green-600' : 'text-gray-500'}`}
          >
            {isCheckedIn ? 'Yes' : 'No'}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Action',
      cell: (info) => {
        const isCheckedIn = info.row.original.tickets?.[0]?.isCheckedIn;
        const ticketNumber = info.row.original.tickets?.[0]?.ticketNumber;
        const isProcessing =
          checkInMutation.isPending &&
          checkInMutation.variables === ticketNumber;
        const canCheckIn =
          info.row.original.status === 'SUCCESS' && !isCheckedIn;

        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isCheckedIn}
              onChange={() =>
                !isCheckedIn &&
                canCheckIn &&
                handleCheckIn(info.row.original.tickets?.[0]?.ticketNumber)
              }
              disabled={!canCheckIn || isProcessing}
              className="rounded border-gray-300 disabled:bg-core-green disabled:cursor-not-allowed cursor-pointer w-5 h-5 text-core-blue focus:ring-core-blue"
              title={
                isCheckedIn
                  ? 'Already checked in'
                  : info.row.original.status !== 'SUCCESS'
                    ? 'Only successful payments can be checked in'
                    : 'Check in attendee'
              }
            />
            {isProcessing && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-core-blue"></div>
            )}
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: displayData,
    columns,
    state: {
      sorting,
      pagination: {
        pageIndex: currentPage - 1, // TanStack uses 0-based indexing
        pageSize: pageSize,
      },
    },
    pageCount: -1, // Unknown total pages
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true, // Server-side pagination
    manualSorting: false, // Client-side sorting on current page data
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!displayData.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-500 text-lg font-medium mb-2">
          No payments found
        </div>
        <p className="text-gray-400">
          No payment records match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    <div className="flex items-center space-x-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <span className="text-gray-400">
                          {[header.column.getIsSorted() as string]}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="w-full flex items-center justify-center gap-2 lg:gap-5 fixed bottom-0 left-1/2 -translate-x-1/2 bg-white py-3 px-5 rounded shadow">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Show</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1); // Reset to first page
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!paginationInfo.hasPrevPage}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-700 px-3 py-1">
              Page {currentPage}
            </span>
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!paginationInfo.hasNextPage}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentsList;
