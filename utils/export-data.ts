import { Payment } from '@/types/services';

interface ExportDataProps {
  data: Payment[];
  filename?: string;
}

export const exportToCSV = ({
  data,
  filename = 'payments.csv',
}: ExportDataProps) => {
  const headers = [
    'Payment ID',
    'Ticket ID',
    'Attendee Name',
    'Email',
    'Amount',
    'Status',
    'Payment Reference',
    'Payment Method',
    'Paid At',
    'Checked-in',
  ];

  const csvContent = [
    headers.join(','),
    ...data.map((payment) => {
      return [
        payment.id,
        payment.tickets?.[0]?.ticketNumber || 'N/A',
        `"${payment.attendee.fullName}"`,
        payment.attendee.email,
        payment.amount,
        payment.status,
        payment.paymentReference,
        payment.paymentMethod,
        payment.paidAt || 'N/A',
        payment.tickets?.[0].isCheckedIn ? 'Yes' : 'No',
      ].join(',');
    }),
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

export const exportToExcel = async ({
  data,
  filename = 'payments.xlsx',
}: ExportDataProps) => {
  // This requires the 'xlsx' library: npm install xlsx
  const XLSX = await import('xlsx');

  const worksheet = XLSX.utils.json_to_sheet(
    data.map((payment) => {
      return {
        'Payment ID': payment.id,
        'Ticket ID': payment.tickets?.[0]?.ticketNumber || 'N/A',
        'Attendee Name': payment.attendee.fullName,
        Email: payment.attendee.email,
        Amount: payment.amount,
        Status: payment.status,
        'Payment Reference': payment.paymentReference,
        'Payment Method': payment.paymentMethod,
        'Paid At': payment.paidAt || 'N/A',
        'Checked-in': payment.tickets?.[0]?.isCheckedIn ? 'Yes' : 'No',
      };
    })
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments');
  XLSX.writeFile(workbook, filename);
};
