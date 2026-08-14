type PaymentStatus = 'Successful' | 'Failed' | 'Pending';

interface Attendee {
  id: string;
  date: string;
  name: string;
  email: string;
  amount: string;
  status: PaymentStatus;
}

const attendees: Attendee[] = [
  {
    id: '#DF82481',
    date: 'July 25, 2025',
    name: 'Adetunji Oluwapeyibomi',
    email: 'maryesivue@gmail.com',
    amount: '₦8,000',
    status: 'Successful',
  },
  {
    id: '#DF82481',
    date: 'July 25, 2025',
    name: 'Mary Esivue',
    email: 'maryesivue@gmail.com',
    amount: '₦4,000',
    status: 'Successful',
  },
  {
    id: '#DF82481',
    date: 'July 25, 2025',
    name: 'Adetunji Oluwapeyibomi',
    email: 'maryesivue@gmail.com',
    amount: '₦4,000',
    status: 'Failed',
  },
  {
    id: '#DF82481',
    date: 'July 25, 2025',
    name: 'Adetunji Oluwapeyibomi',
    email: 'maryesivue@gmail.com',
    amount: '₦4,000',
    status: 'Pending',
  },
  {
    id: '#DF82481',
    date: 'July 25, 2025',
    name: 'Adetunji Oluwapeyibomi',
    email: 'maryesivue@gmail.com',
    amount: '₦4,000',
    status: 'Successful',
  },
  {
    id: '#DF82481',
    date: 'July 25, 2025',
    name: 'Adetunji Oluwapeyibomi',
    email: 'maryesivue@gmail.com',
    amount: '₦4,000',
    status: 'Successful',
  },
];

const statusConfig: Record<
  PaymentStatus,
  { bg: string; text: string; dot: string }
> = {
  Successful: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    dot: 'bg-green-500',
  },
  Failed: { bg: 'bg-red-50', text: 'text-red-500', dot: 'bg-red-500' },
  Pending: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    dot: 'bg-yellow-400',
  },
};

const COLUMNS = [
  'Ticket ID',
  'Date',
  'Full Name',
  'Email Address',
  'Amount',
  'Status',
];

export default function RecentAttendeesTable() {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="text-left px-6 py-4 text-[13px] font-medium text-gray-500 whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attendees.map((row, index) => {
            const style = statusConfig[row.status];
            return (
              <tr
                key={index}
                className="bg-white border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-[18px] text-[13px] text-gray-700 font-medium">
                  {row.id}
                </td>
                <td className="px-6 py-[18px] text-[13px] text-gray-600">
                  {row.date}
                </td>
                <td className="px-6 py-[18px] text-[13px] text-gray-700">
                  {row.name}
                </td>
                <td className="px-6 py-[18px] text-[13px] text-gray-500">
                  {row.email}
                </td>
                <td className="px-6 py-[18px] text-[13px] text-gray-700 font-medium">
                  {row.amount}
                </td>
                <td className="px-6 py-[18px]">
                  <span
                    className={`inline-flex items-center gap-[6px] px-3 py-[5px] rounded-full text-[12px] font-medium ${style.bg} ${style.text}`}
                  >
                    <span
                      className={`w-[7px] h-[7px] rounded-[2px] flex-shrink-0 ${style.dot}`}
                    />
                    {row.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
