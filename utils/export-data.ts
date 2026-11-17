import { Payment } from '@/types/services';
import { downloadContactsCsv } from './contacts-csv';

interface ExportDataProps {
  data: Payment[];
  filename?: string;
}

export const exportToCSV = ({
  data,
  filename = 'payments.csv',
}: ExportDataProps) => {
  downloadContactsCsv(
    data.map((payment) => ({
      email: payment.attendee.email,
      fullName: payment.attendee.fullName,
    })),
    filename
  );
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
