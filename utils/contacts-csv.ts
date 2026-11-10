/**
 * Every CSV download in the app uses this one shape:
 *
 *   email,first_name,last_name
 *
 * so any export can be fed straight back into an import (bulk discount
 * recipients, mailing lists, etc.).
 */
export const CONTACT_CSV_HEADERS = ['email', 'first_name', 'last_name'] as const;

export interface ContactRow {
  email: string;
  fullName?: string | null;
}

/** "Ada Obi Lovelace" -> first "Ada", last "Obi Lovelace". */
export function splitName(fullName?: string | null) {
  const parts = (fullName ?? '').trim().split(/\s+/).filter(Boolean);
  return { first: parts[0] ?? '', last: parts.slice(1).join(' ') };
}

function cell(value: string) {
  // Quote every cell and neutralise spreadsheet formulas (=, +, -, @).
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

/** A CSV file never holds more than this many contact rows. */
export const CSV_MAX_ROWS = 1000;

/** Unique (by email, case-insensitive) contacts as [email, first, last]. */
function uniqueContacts(rows: ContactRow[]) {
  const seen = new Set<string>();
  const out: string[][] = [];

  for (const row of rows) {
    const email = (row.email ?? '').trim();
    const key = email.toLowerCase();
    if (!email || seen.has(key)) continue;
    seen.add(key);
    const { first, last } = splitName(row.fullName);
    out.push([email, first, last]);
  }
  return out;
}

function toCsv(contacts: string[][]) {
  return [
    CONTACT_CSV_HEADERS.join(','),
    ...contacts.map((c) => c.map(cell).join(',')),
  ].join('\n');
}

/** Contacts as one or more CSV strings, each with at most `CSV_MAX_ROWS` rows. */
export function buildContactsCsvParts(rows: ContactRow[]) {
  const contacts = uniqueContacts(rows);
  const parts: string[] = [];
  for (let i = 0; i < contacts.length; i += CSV_MAX_ROWS) {
    parts.push(toCsv(contacts.slice(i, i + CSV_MAX_ROWS)));
  }
  if (parts.length === 0) parts.push(toCsv([]));
  return { parts, contacts: contacts.length };
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export interface ContactsDownloadResult {
  /** Unique contacts written. */
  contacts: number;
  /** CSV files produced (more than 1 means they were bundled into a .zip). */
  files: number;
}

/**
 * Downloads the contacts as CSV. Up to 1,000 rows -> a single `.csv`.
 * More than that -> parts of 1,000 rows each, bundled into one `.zip`.
 * `filename` should end in `.csv`.
 */
export async function downloadContactsCsv(
  rows: ContactRow[],
  filename: string
): Promise<ContactsDownloadResult> {
  const { parts, contacts } = buildContactsCsvParts(rows);

  if (parts.length === 1) {
    saveBlob(new Blob([parts[0]], { type: 'text/csv;charset=utf-8;' }), filename);
    return { contacts, files: 1 };
  }

  const { zipSync, strToU8 } = await import('fflate');
  const base = filename.replace(/\.csv$/i, '');
  const entries: Record<string, Uint8Array> = {};
  parts.forEach((csv, i) => {
    entries[`${base}-part-${i + 1}-of-${parts.length}.csv`] = strToU8(csv);
  });
  saveBlob(
    new Blob([zipSync(entries)], { type: 'application/zip' }),
    `${base}.zip`
  );
  return { contacts, files: parts.length };
}

/** Message to show the admin when an export was split into a .zip, else null. */
export function zipNotice({ contacts, files }: ContactsDownloadResult) {
  return files > 1
    ? `Exported ${contacts.toLocaleString()} contacts as ${files} CSV files (max ${CSV_MAX_ROWS.toLocaleString()} each) in one .zip.`
    : null;
}
