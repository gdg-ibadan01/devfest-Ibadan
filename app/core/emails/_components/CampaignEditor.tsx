'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Send, Save, Trash2, FlaskConical } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useMe,
  useAudienceCount,
  useDeleteEmailCampaign,
  useEmailPreview,
  useSaveEmailCampaign,
  useSendEmailCampaign,
  useSendTestEmail,
  useTickets,
} from '@/app/_module/services';
import { showToast } from '@/app/_module/lib/notify';
import type {
  CampaignAudience,
  EmailCampaignDto,
} from '@/app/_module/api/types';

const TOKENS = [
  { token: '{{first_name}}', hint: 'First name' },
  { token: '{{full_name}}', hint: 'Full name' },
  { token: '{{ticket_code}}', hint: 'Ticket code' },
  { token: '{{ticket_link}}', hint: 'Ticket download link' },
];

const TEST_RECIPIENTS_KEY = 'emails:test-recipients';
const MAX_TEST_RECIPIENTS = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Splits "a@x.com, b@y.com\nc@z.com" into trimmed, de-duplicated addresses. */
function parseEmails(input: string) {
  const seen = new Set<string>();
  return input
    .split(/[\s,;]+/)
    .map((e) => e.trim())
    .filter((e) => {
      const key = e.toLowerCase();
      if (!e || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

const SUBJECT_MAX = 150;
const PREHEADER_MAX = 150;

const inputClass =
  'w-full rounded-lg border border-gray-300 px-[12px] py-[10px] text-[14px] outline-none focus:border-[#1e1e1e]';
const labelClass = 'mb-[6px] block text-[13px] font-medium text-[#1e1e1e]';

/** Composer for a draft email: subject, preview text, body, audience, live preview. */
export default function CampaignEditor({
  campaign,
}: {
  campaign?: EmailCampaignDto;
}) {
  const router = useRouter();
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const [subject, setSubject] = useState(campaign?.subject ?? '');
  const [preheader, setPreheader] = useState(campaign?.preheader ?? '');
  const [body, setBody] = useState(campaign?.body ?? '');
  const [audience, setAudience] = useState<CampaignAudience>(
    campaign?.audience ?? {}
  );
  const [savedId, setSavedId] = useState<string | undefined>(campaign?.id);

  const save = useSaveEmailCampaign(savedId);
  const remove = useDeleteEmailCampaign();
  const sendTest = useSendTestEmail();
  const { data: me } = useMe();
  const [testInput, setTestInput] = useState('');
  const testEmails = parseEmails(testInput);
  const invalidTestEmails = testEmails.filter((e) => !EMAIL_RE.test(e));
  const testError =
    invalidTestEmails.length > 0
      ? `Not a valid email: ${invalidTestEmails.join(', ')}`
      : testEmails.length > MAX_TEST_RECIPIENTS
        ? `Up to ${MAX_TEST_RECIPIENTS} addresses at a time`
        : null;
  const send = useSendEmailCampaign();
  const { data: ticketsData } = useTickets({ limit: 50 });
  const tickets = ticketsData?.data ?? [];

  const { data: audienceCount, isFetching: countLoading } =
    useAudienceCount(audience);

  const debounced = useDebounce({ subject, preheader, body }, 600);
  const { data: preview, isFetching: previewLoading } =
    useEmailPreview(debounced);

  const canSave = subject.trim().length > 0 && body.trim().length > 0;
  const busy = save.isPending || send.isPending || sendTest.isPending;

  const payload = useMemo(
    () => ({ subject: subject.trim(), preheader: preheader.trim(), body, audience }),
    [subject, preheader, body, audience]
  );

  const saveDraft = async (): Promise<string | undefined> => {
    if (!canSave) {
      showToast.error('Add a subject and a message first');
      return undefined;
    }
    const saved = await save.mutateAsync(payload);
    setSavedId(saved.id);
    return saved.id;
  };

  const onSaveDraft = async () => {
    const id = await saveDraft();
    if (!id) return;
    showToast.success('Draft saved');
    if (!campaign) router.replace(`/core/emails/${id}`);
  };

  // Remember who you tested with; default to your own address the first time.
  useEffect(() => {
    let saved = '';
    try {
      saved = window.localStorage.getItem(TEST_RECIPIENTS_KEY) ?? '';
    } catch {
      // storage unavailable: fall back to the default below
    }
    setTestInput((current) => current || saved || me?.email || '');
  }, [me?.email]);

  const onSendTest = async () => {
    if (testEmails.length === 0) {
      showToast.error('Enter at least one email address to test with');
      return;
    }
    if (testError) {
      showToast.error(testError);
      return;
    }
    const id = await saveDraft();
    if (!id) return;
    try {
      window.localStorage.setItem(TEST_RECIPIENTS_KEY, testEmails.join(', '));
    } catch {
      // not critical
    }
    sendTest.mutate({ id, emails: testEmails });
  };

  const onSend = async () => {
    const count = audienceCount ?? 0;
    if (count === 0) {
      showToast.error('No ticket holders match this audience');
      return;
    }
    if (
      !window.confirm(
        `Send "${subject.trim()}" to ${count.toLocaleString()} ticket holder${count === 1 ? '' : 's'}?\n\nThis cannot be undone. Tip: send yourself a test first.`
      )
    ) {
      return;
    }
    const id = await saveDraft();
    if (!id) return;
    await send.mutateAsync(id);
    router.replace(`/core/emails/${id}`);
  };

  const insertToken = (token: string) => {
    const el = bodyRef.current;
    if (!el) {
      setBody((b) => b + token);
      return;
    }
    const start = el.selectionStart ?? body.length;
    const end = el.selectionEnd ?? body.length;
    const next = body.slice(0, start) + token + body.slice(end);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + token.length, start + token.length);
    });
  };

  return (
    <div className="grid gap-[24px] px-[20px] py-[24px] lg:grid-cols-2 lg:px-[32px]">
      {/* ---- Compose ---- */}
      <div className="space-y-[20px]">
        <div>
          <label htmlFor="email-subject" className={labelClass}>
            Subject
          </label>
          <input
            id="email-subject"
            className={inputClass}
            value={subject}
            maxLength={SUBJECT_MAX}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Your DevFest Ibadan venue details"
          />
        </div>

        <div>
          <label htmlFor="email-preheader" className={labelClass}>
            Preview text{' '}
            <span className="font-normal text-gray-500">
              (shown next to the subject in the inbox)
            </span>
          </label>
          <input
            id="email-preheader"
            className={inputClass}
            value={preheader}
            maxLength={PREHEADER_MAX}
            onChange={(e) => setPreheader(e.target.value)}
            placeholder="A short teaser that makes people open it"
          />
          <p className="mt-[4px] text-right text-[12px] text-gray-400">
            {preheader.length}/{PREHEADER_MAX}
          </p>
        </div>

        <div>
          <label htmlFor="email-body" className={labelClass}>
            Message
          </label>
          <div className="mb-[8px] flex flex-wrap gap-[6px]">
            {TOKENS.map(({ token, hint }) => (
              <button
                key={token}
                type="button"
                title={hint}
                onClick={() => insertToken(token)}
                className="rounded-md border border-gray-300 px-[8px] py-[4px] font-mono text-[12px] hover:bg-gray-50"
              >
                {token}
              </button>
            ))}
          </div>
          <textarea
            id="email-body"
            ref={bodyRef}
            className={`${inputClass} min-h-[260px] font-sans leading-relaxed`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={'Hi {{first_name}},\n\nWrite your message here.'}
          />
          <p className="mt-[4px] text-[12px] text-gray-500">
            Blank line = new paragraph. <code>**bold**</code>,{' '}
            <code>*italic*</code>, <code>- bullet</code>,{' '}
            <code>[link text](https://…)</code>. Use{' '}
            <code>[Download your ticket]({'{{ticket_link}}'})</code> for the
            person&apos;s own ticket link.
          </p>
        </div>

        <fieldset className="rounded-xl border border-gray-200 p-[16px]">
          <legend className="px-[6px] text-[13px] font-medium">
            Who gets it
          </legend>
          <div className="space-y-[12px]">
            <div>
              <label htmlFor="aud-ticket" className={labelClass}>
                Ticket type
              </label>
              <select
                id="aud-ticket"
                className={inputClass}
                value={audience.ticketId ?? ''}
                onChange={(e) =>
                  setAudience((a) => ({
                    ...a,
                    ticketId: e.target.value || undefined,
                  }))
                }
              >
                <option value="">All ticket types</option>
                {tickets.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="aud-checkin" className={labelClass}>
                Check-in
              </label>
              <select
                id="aud-checkin"
                className={inputClass}
                value={
                  audience.checkedIn === undefined
                    ? ''
                    : audience.checkedIn
                      ? 'yes'
                      : 'no'
                }
                onChange={(e) =>
                  setAudience((a) => ({
                    ...a,
                    checkedIn:
                      e.target.value === ''
                        ? undefined
                        : e.target.value === 'yes',
                  }))
                }
              >
                <option value="">Everyone</option>
                <option value="yes">Checked in only</option>
                <option value="no">Not checked in yet</option>
              </select>
            </div>
            <label className="flex items-center gap-[8px] text-[13px]">
              <input
                type="checkbox"
                checked={Boolean(audience.ticketEmailNotConfirmed)}
                onChange={(e) =>
                  setAudience((a) => ({
                    ...a,
                    ticketEmailNotConfirmed: e.target.checked || undefined,
                  }))
                }
              />
              Only people whose ticket email isn&apos;t confirmed sent
            </label>
            <p className="text-[13px] text-gray-600">
              Everyone with a paid or free ticket, one email per address:{' '}
              <strong>
                {countLoading && audienceCount === undefined
                  ? '…'
                  : (audienceCount ?? 0).toLocaleString()}
              </strong>{' '}
              recipient{audienceCount === 1 ? '' : 's'}
            </p>
          </div>
        </fieldset>

        <fieldset className="rounded-xl border border-gray-200 p-[16px]">
          <legend className="px-[6px] text-[13px] font-medium">
            Send a test first
          </legend>
          <label htmlFor="test-emails" className={labelClass}>
            Send the test to{' '}
            <span className="font-normal text-gray-500">
              (your email, or organizers&apos; — separate with commas or new lines)
            </span>
          </label>
          <textarea
            id="test-emails"
            className={`${inputClass} min-h-[64px]`}
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="you@example.com, organizer@example.com"
            aria-invalid={Boolean(testError)}
          />
          {testError ? (
            <p className="mt-[4px] text-[12px] text-red-600">{testError}</p>
          ) : (
            <p className="mt-[4px] text-[12px] text-gray-500">
              {testEmails.length} address{testEmails.length === 1 ? '' : 'es'}.
              Test emails are marked [Test], use sample details (Ada Obi), and
              aren&apos;t counted as sent to ticket holders. The ticket link in a
              test is a placeholder.
            </p>
          )}
          <button
            type="button"
            onClick={onSendTest}
            disabled={busy || !canSave || testEmails.length === 0 || Boolean(testError)}
            className="mt-[10px] inline-flex h-[40px] items-center gap-[8px] rounded-lg border border-gray-300 px-[16px] text-[13px] font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {sendTest.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <FlaskConical size={14} />
            )}
            Send test{testEmails.length > 1 ? ` to ${testEmails.length}` : ''}
          </button>
        </fieldset>

        <div className="flex flex-wrap gap-[10px]">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={busy || !canSave}
            className="inline-flex h-[42px] items-center gap-[8px] rounded-lg border border-gray-300 px-[16px] text-[13px] font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {save.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            Save draft
          </button>
          <button
            type="button"
            onClick={onSend}
            disabled={busy || !canSave}
            className="inline-flex h-[42px] items-center gap-[8px] rounded-lg bg-[#1e1e1e] px-[16px] text-[13px] font-medium text-white hover:bg-black/80 disabled:opacity-50"
          >
            {send.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            Send to {audienceCount !== undefined ? audienceCount.toLocaleString() : '…'}
          </button>
          {campaign && (
            <button
              type="button"
              onClick={async () => {
                if (!window.confirm('Delete this draft?')) return;
                await remove.mutateAsync(campaign.id);
                router.replace('/core/emails');
              }}
              disabled={busy || remove.isPending}
              className="ml-auto inline-flex h-[42px] items-center gap-[8px] rounded-lg px-[12px] text-[13px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      </div>

      {/* ---- Preview ---- */}
      <div>
        <div className="mb-[8px] flex items-center justify-between">
          <p className="text-[13px] font-medium">Preview</p>
          {previewLoading && (
            <Loader2 size={14} className="animate-spin text-gray-400" />
          )}
        </div>
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-[16px] py-[10px]">
            <p className="truncate text-[14px] font-semibold">
              {preview?.subject || subject || 'Subject'}
            </p>
            <p className="truncate text-[12px] text-gray-500">
              {preheader || 'Preview text'}
            </p>
          </div>
          {preview ? (
            <iframe
              title="Email preview"
              sandbox=""
              srcDoc={preview.html}
              className="h-[620px] w-full rounded-b-xl"
            />
          ) : (
            <p className="p-[24px] text-[13px] text-gray-500">
              Start typing a subject and message to see how it will look.
            </p>
          )}
        </div>
        <p className="mt-[8px] text-[12px] text-gray-500">
          Shown with sample details (Ada Obi, ticket code ABC123).
        </p>
      </div>
    </div>
  );
}
