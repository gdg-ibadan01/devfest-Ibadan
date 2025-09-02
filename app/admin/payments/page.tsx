'use client';

import React, { Fragment, useMemo } from 'react';
import { AdminClass as styles } from '../styles/admin.classes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlertCircle, ChevronDown, RefreshCcw } from 'lucide-react';
import CheckCircleIcon from '@/app/_module/components/icons/CheckCircleIcon';
import ExportIcon from '@/app/_module/components/icons/ExportIcon';
import { useGetAllPayments } from '@/hooks/useAdminAuth';
import { exportToCSV, exportToExcel } from '@/utils/export-data';
import PaymentsList from '../components/PaymentList';
import AddAttendeesModal from '../components/AddAttendeesModal';

const PaymentsPage = () => {
  const [status, setStatus] = React.useState('All');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [open, setOpen] = React.useState<boolean>(false);

  const statuses = ['All', 'SUCCESS', 'PENDING', 'FAILED'];
  const exports = ['CSV', 'Excel'];

  // Query parameters for API call - server-side pagination
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
    }),
    [currentPage, pageSize]
  );

  // Fetch paginated payments data from server
  const {
    data: paymentsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllPayments(queryParams);

  // Client-side filtering and searching on the current page data
  const filteredPayments = useMemo(() => {
    if (!paymentsResponse?.data) return [];

    let filtered = paymentsResponse.data;

    // Filter by status (client-side)
    if (status !== 'All') {
      filtered = filtered.filter((payment) => payment.status === status);
    }

    // Filter by search term (name/email) - client-side
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (payment) =>
          payment.attendee.fullName.toLowerCase().includes(searchLower) ||
          payment.attendee.email.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [paymentsResponse?.data, status, searchTerm]);

  // Calculate pagination info without server metadata
  const paginationInfo = useMemo(() => {
    if (!paymentsResponse?.data)
      return { hasNextPage: false, hasPrevPage: false };

    const dataLength = paymentsResponse.data.length;
    const hasNextPage = dataLength === pageSize; // If we got full page, likely more data exists
    const hasPrevPage = currentPage > 1;

    return { hasNextPage, hasPrevPage, dataLength };
  }, [paymentsResponse, pageSize, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleExport = async (format: 'CSV' | 'Excel') => {
    if (!filteredPayments.length) return;

    const filename = `payments_${new Date().toISOString().split('T')[0]}`;

    try {
      if (format === 'CSV') {
        exportToCSV(filteredPayments, `${filename}.csv`);
      } else {
        await exportToExcel(filteredPayments, `${filename}.xlsx`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  // Error state
  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <AlertCircle className="w-40 h-40 text-red mb-4" />
            <div className="text-red text-xl font-semibold mb-3">
              Error loading payments
            </div>
            <p className="text-red mb-6 text-center max-w-md">
              {error ? error?.message : 'Something went wrong'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2.5 bg-gray-700 text-white rounded-md hover:brightness-50
            transition-colors duration-200 flex items-center gap-2 font-medium"
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h3 className={styles.title}>all payments</h3>
          <div className={styles.searchInputContainer}>
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="Search by name/email"
                className={styles.searchInput}
                value={searchTerm}
                onChange={handleSearchChange}
              />

              {/* Status Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className={styles.dropdown}>
                  <button className="flex items-center justify-between">
                    {status} <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[150px]">
                  {statuses.map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => setStatus(s)}
                      className="flex items-center text-[#474C52] text-[14px] font-normal justify-between"
                    >
                      {s}
                      {status === s && <CheckCircleIcon />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className={styles.actionBtnsContainer}>
              {/* Export Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={styles.exportBtn}
                    disabled={isLoading || !filteredPayments.length}
                  >
                    <ExportIcon /> <span>Export</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {exports.map((e) => (
                    <DropdownMenuItem
                      key={e}
                      onClick={() => handleExport(e as 'CSV' | 'Excel')}
                      className="text-[#474C52] text-[14px] font-normal"
                    >
                      {e}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <button className={styles.addBtn} onClick={() => setOpen(true)}>
                Add attendee
              </button>
            </div>
          </div>
          <PaymentsList
            payments={filteredPayments}
            isLoading={isLoading}
            currentPage={currentPage}
            pageSize={pageSize}
            paginationInfo={paginationInfo}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
      <AddAttendeesModal open={open} onOpenChange={setOpen} />
    </Fragment>
  );
};

export default PaymentsPage;
