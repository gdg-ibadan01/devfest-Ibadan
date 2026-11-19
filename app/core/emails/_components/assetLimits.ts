/** Mirrors backend/src/modules/email-campaign/email-asset.util.ts so people get an instant error. */
export const MAX_FILE_BYTES = 4 * 1024 * 1024;
export const MAX_ATTACHMENTS = 5;
export const MAX_ATTACHMENT_TOTAL_BYTES = 10 * 1024 * 1024;
export const MAX_INLINE_IMAGES = 10;

export const ATTACHMENT_EXTENSIONS = [
  'pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'doc', 'docx', 'xls', 'xlsx',
  'ppt', 'pptx', 'csv', 'txt',
];
export const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

export const ATTACHMENT_ACCEPT = ATTACHMENT_EXTENSIONS.map((e) => `.${e}`).join(',');
export const IMAGE_ACCEPT = IMAGE_EXTENSIONS.map((e) => `.${e}`).join(',');

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Returns a message when the file cannot be accepted, otherwise null. */
export function checkFile(
  file: File,
  kind: 'ATTACHMENT' | 'INLINE_IMAGE',
  existing: { size: number }[]
): string | null {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const allowed = kind === 'INLINE_IMAGE' ? IMAGE_EXTENSIONS : ATTACHMENT_EXTENSIONS;
  if (!allowed.includes(ext)) {
    return kind === 'INLINE_IMAGE'
      ? `${file.name}: use a PNG, JPG, GIF or WebP image`
      : `${file.name}: this file type is not allowed (use PDF, images, Word, Excel, PowerPoint, CSV or text)`;
  }
  if (file.size === 0) return `${file.name} is empty`;
  if (file.size > MAX_FILE_BYTES) {
    return `${file.name} is ${formatBytes(file.size)}; each file can be at most 4 MB`;
  }
  if (kind === 'ATTACHMENT') {
    if (existing.length >= MAX_ATTACHMENTS) {
      return `You can attach at most ${MAX_ATTACHMENTS} files`;
    }
    const total = existing.reduce((s, a) => s + a.size, 0) + file.size;
    if (total > MAX_ATTACHMENT_TOTAL_BYTES) {
      return 'Attachments can be at most 10 MB in total';
    }
  } else if (existing.length >= MAX_INLINE_IMAGES) {
    return `You can add at most ${MAX_INLINE_IMAGES} images`;
  }
  return null;
}
