/** "<abc@host>" and "ABC@host" compare equal; used to match provider webhooks to our sends. */
export function normalizeMessageId(id?: string | null): string | null {
  const v = (id ?? '').trim().replace(/^<|>$/g, '').toLowerCase();
  return v || null;
}
