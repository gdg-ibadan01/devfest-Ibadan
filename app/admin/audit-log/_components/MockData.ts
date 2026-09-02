import type { AuditLogRecord } from "../_types/audit-log.types";

const MOCK_LOGS: AuditLogRecord[] = [
  { id: '1', logId: 'LOG-2048600091', team: 'Mary Esivue', role: 'Super Admin', action: 'Created Attendee', time: '10:24:28', date: '15th March, 2025' },
  { id: '2', logId: 'LOG-2048600091', team: 'Mary Esivue', role: 'Super Admin', action: 'Created referral', time: '10:24:28', date: '15th March, 2025' },
  { id: '3', logId: 'LOG-2048600091', team: 'Mary Esivue', role: 'Super Admin', action: 'Created referral', time: '10:24:28', date: '15th March, 2025' },
  { id: '4', logId: 'LOG-2048600091', team: 'Mary Esivue', role: 'Super Admin', action: 'Created referral', time: '10:24:28', date: '15th March, 2025' },
  { id: '5', logId: 'LOG-2048600091', team: 'Mary Esivue', role: 'Super Admin', action: 'Created referral', time: '10:24:28', date: '15th March, 2025' },
];

export default MOCK_LOGS;
