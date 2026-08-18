export interface AuditLogRecord {
  id: string;
  logId: string;
  team: string;
  role: string;
  action: string;
  time: string;
  date: string;
}
