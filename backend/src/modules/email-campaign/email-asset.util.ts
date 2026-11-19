import { BadRequestException } from '@nestjs/common';
import { EmailAssetKind } from '@prisma/client';

/** Limits chosen to fit behind a serverless proxy and stay far below the provider's 40 MB cap. */
export const EMAIL_ASSET_LIMITS = {
  maxFileBytes: 4 * 1024 * 1024,
  maxAttachments: 5,
  maxAttachmentTotalBytes: 10 * 1024 * 1024,
  maxInlineImages: 10,
} as const;

interface AllowedType {
  mime: string;
  exts: string[];
  /** First bytes of a genuine file; undefined means text-like (checked separately). */
  magic?: number[][];
  image?: boolean;
}

const ZIP = [[0x50, 0x4b, 0x03, 0x04]];
const OLE = [[0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]];

export const ALLOWED_EMAIL_TYPES: AllowedType[] = [
  {
    mime: 'image/png',
    exts: ['png'],
    magic: [[0x89, 0x50, 0x4e, 0x47]],
    image: true,
  },
  {
    mime: 'image/jpeg',
    exts: ['jpg', 'jpeg'],
    magic: [[0xff, 0xd8, 0xff]],
    image: true,
  },
  {
    mime: 'image/gif',
    exts: ['gif'],
    magic: [[0x47, 0x49, 0x46, 0x38]],
    image: true,
  },
  {
    mime: 'image/webp',
    exts: ['webp'],
    magic: [[0x52, 0x49, 0x46, 0x46]],
    image: true,
  },
  { mime: 'application/pdf', exts: ['pdf'], magic: [[0x25, 0x50, 0x44, 0x46]] },
  {
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    exts: ['docx'],
    magic: ZIP,
  },
  {
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    exts: ['xlsx'],
    magic: ZIP,
  },
  {
    mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    exts: ['pptx'],
    magic: ZIP,
  },
  { mime: 'application/msword', exts: ['doc'], magic: OLE },
  { mime: 'application/vnd.ms-excel', exts: ['xls'], magic: OLE },
  { mime: 'application/vnd.ms-powerpoint', exts: ['ppt'], magic: OLE },
  { mime: 'text/csv', exts: ['csv'] },
  { mime: 'text/plain', exts: ['txt'] },
];

export interface ValidatedAsset {
  filename: string;
  mimeType: string;
  size: number;
  isImage: boolean;
}

/** Strips paths and anything that could break a header or a download name. */
export function sanitizeFilename(name: string) {
  const base = name.split(/[\\/]/).pop() ?? 'file';
  const cleaned = base
    .normalize('NFKD')
    .replace(/[^\w.\- ()]+/g, '_')
    .replace(/\.{2,}/g, '.')
    .trim()
    .slice(0, 100);
  return cleaned && cleaned !== '.' ? cleaned : 'file';
}

function startsWith(buffer: Buffer, magic: number[]) {
  return magic.every((byte, i) => buffer[i] === byte);
}

/** Text files must not contain NUL bytes (a cheap "this is really binary" check). */
function looksLikeText(buffer: Buffer) {
  return !buffer.subarray(0, 4096).includes(0);
}

/**
 * Accepts only the allowed types, and only when the extension, the declared
 * mime type and the file's own first bytes all agree, so a renamed executable
 * is rejected. Size limits are checked by the caller against the campaign.
 */
export function validateEmailAsset(
  file: {
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
  },
  kind: EmailAssetKind,
): ValidatedAsset {
  const filename = sanitizeFilename(file.originalname);
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  const type = ALLOWED_EMAIL_TYPES.find((t) => t.exts.includes(ext));
  if (!type) {
    throw new BadRequestException(
      'This file type is not allowed. Use PDF, images, Word, Excel, PowerPoint, CSV or text files.',
    );
  }
  // Browsers sometimes send text/csv as application/vnd.ms-excel or octet-stream.
  const declared = file.mimetype.toLowerCase();
  const mimeOk =
    declared === type.mime ||
    declared === 'application/octet-stream' ||
    (type.mime === 'text/csv' && declared === 'application/vnd.ms-excel') ||
    (type.mime === 'image/jpeg' && declared === 'image/jpg');
  if (!mimeOk) {
    throw new BadRequestException('The file content does not match its type');
  }
  if (
    file.size > EMAIL_ASSET_LIMITS.maxFileBytes ||
    file.buffer.length > EMAIL_ASSET_LIMITS.maxFileBytes
  ) {
    throw new BadRequestException('Each file can be at most 4 MB');
  }
  if (file.buffer.length === 0) {
    throw new BadRequestException('The file is empty');
  }
  const genuine = type.magic
    ? type.magic.some((m) => startsWith(file.buffer, m))
    : looksLikeText(file.buffer);
  if (!genuine) {
    throw new BadRequestException('The file content does not match its type');
  }
  if (kind === EmailAssetKind.INLINE_IMAGE && !type.image) {
    throw new BadRequestException(
      'Only images can be placed in the email body',
    );
  }
  return {
    filename,
    mimeType: type.mime,
    size: file.buffer.length,
    isImage: Boolean(type.image),
  };
}
