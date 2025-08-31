import { Payment } from '@/types/services';

export const exportToCSV = (data: Payment[], filename = 'payments.csv') => {
  const headers = [
    'Payment ID',
    'Attendee Name',
    'Email',
    'Amount',
    'Currency',
    'Status',
    'Payment Method',
    'Payment Reference',
    'Paid At',
    'Created At',
  ];

  const csvContent = [
    headers.join(','),
    ...data.map((payment) =>
      [
        payment.id,
        `"${payment.attendee.fullName}"`,
        payment.attendee.email,
        payment.amount,
        payment.currency,
        payment.status,
        payment.paymentMethod,
        payment.paymentReference,
        payment.paidAt || 'N/A',
        new Date(payment.createdAt).toLocaleString(),
      ].join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportToExcel = async (
  data: Payment[],
  filename = 'payments.xlsx'
) => {
  // This requires the 'xlsx' library: npm install xlsx
  const XLSX = await import('xlsx');

  const worksheet = XLSX.utils.json_to_sheet(
    data.map((payment) => ({
      'Payment ID': payment.id,
      'Attendee Name': payment.attendee.fullName,
      Email: payment.attendee.email,
      Amount: payment.amount,
      Currency: payment.currency,
      Status: payment.status,
      'Payment Method': payment.paymentMethod,
      'Payment Reference': payment.paymentReference,
      'Paystack Reference': payment.paystackReference,
      'Paid At': payment.paidAt || 'N/A',
      'Failure Reason': payment.failureReason || 'N/A',
      'Created At': new Date(payment.createdAt).toLocaleString(),
      'Updated At': new Date(payment.updatedAt).toLocaleString(),
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments');
  XLSX.writeFile(workbook, filename);
};
