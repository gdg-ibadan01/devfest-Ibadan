'use client';

import { useRef, useState } from 'react';
import { FileText, Loader2, Paperclip, Trash2, X } from 'lucide-react';
import type { EmailAssetDto } from '@/app/_module/api/types';
import {
  ATTACHMENT_ACCEPT,
  MAX_ATTACHMENTS,
  formatBytes,
} from './assetLimits';

/** Attach files to a draft: pick or drop files, see what will be sent, remove any. */
export default function CampaignAssets({
  attachments,
  uploading,
  removing,
  disabled,
  onAdd,
  onRemove,
}: {
  attachments: EmailAssetDto[];
  uploading: boolean;
  removing: boolean;
  disabled?: boolean;
  onAdd: (files: File[]) => void;
  onRemove: (asset: EmailAssetDto) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const total = attachments.reduce((s, a) => s + a.size, 0);

  return (
    <fieldset className="rounded-xl border border-gray-200 p-[16px]">
      <legend className="px-[6px] text-[13px] font-medium">Attachments</legend>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled) onAdd(Array.from(e.dataTransfer.files));
        }}
        className={`flex flex-col items-center gap-[8px] rounded-lg border border-dashed px-[16px] py-[18px] text-center ${
          dragging ? 'border-[#1e1e1e] bg-gray-50' : 'border-gray-300'
        }`}
      >
        <button
          type="button"
          disabled={disabled || uploading || attachments.length >= MAX_ATTACHMENTS}
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-[38px] items-center gap-[8px] rounded-lg border border-gray-300 px-[14px] text-[13px] font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Paperclip size={14} />
          )}
          {uploading ? 'Uploading…' : 'Attach files'}
        </button>
        <p className="text-[12px] text-gray-500">
          or drop them here. PDF, images, Word, Excel, PowerPoint, CSV or text;
          up to {MAX_ATTACHMENTS} files, 4 MB each, 10 MB in total.
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept={ATTACHMENT_ACCEPT}
          onChange={(e) => {
            onAdd(Array.from(e.target.files ?? []));
            e.target.value = '';
          }}
        />
      </div>

      {attachments.length > 0 && (
        <>
          <ul className="mt-[12px] space-y-[6px]">
            {attachments.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-[10px] rounded-lg bg-gray-50 px-[10px] py-[8px] text-[13px]"
              >
                <FileText size={15} className="shrink-0 text-gray-500" />
                <span className="min-w-0 flex-1 truncate" title={a.filename}>
                  {a.filename}
                </span>
                <span className="shrink-0 text-[12px] text-gray-500">
                  {formatBytes(a.size)}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${a.filename}`}
                  disabled={disabled || removing}
                  onClick={() => onRemove(a)}
                  className="shrink-0 rounded p-[4px] text-gray-500 hover:bg-gray-200 hover:text-red-600 disabled:opacity-50"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-[8px] text-[12px] text-gray-500">
            {attachments.length} file{attachments.length === 1 ? '' : 's'},{' '}
            {formatBytes(total)}. Every recipient gets these files with the
            email.
          </p>
        </>
      )}
    </fieldset>
  );
}

/** Small "images in this email" strip; used under the message box. */
export function ImageStrip({
  images,
  removing,
  onInsert,
  onRemove,
}: {
  images: EmailAssetDto[];
  removing: boolean;
  onInsert: (asset: EmailAssetDto) => void;
  onRemove: (asset: EmailAssetDto) => void;
}) {
  if (images.length === 0) return null;
  return (
    <ul className="mt-[8px] flex flex-wrap gap-[8px]">
      {images.map((img) => (
        <li
          key={img.id}
          className="relative w-[84px] overflow-hidden rounded-lg border border-gray-200"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt={img.filename}
            className="h-[60px] w-full object-cover"
          />
          <div className="flex items-center justify-between px-[4px] py-[2px]">
            <button
              type="button"
              onClick={() => onInsert(img)}
              className="text-[11px] font-medium text-core-blue hover:underline"
            >
              Insert
            </button>
            <button
              type="button"
              aria-label={`Remove ${img.filename}`}
              disabled={removing}
              onClick={() => onRemove(img)}
              className="text-gray-500 hover:text-red-600 disabled:opacity-50"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
