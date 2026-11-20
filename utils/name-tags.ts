/**
 * Printable name tags: A4 portrait, 2 × 5 tags per page (≈ 95 × 54 mm,
 * standard badge-insert size) with light cut guides. Long names shrink to
 * fit on one line, then wrap to two.
 */
export interface NameTag {
  fullName: string;
  subtitle?: string;
}

const PAGE_W = 210;
const PAGE_H = 297;
const COLS = 2;
const ROWS = 5;
const TAG_W = 95;
const TAG_H = 54;
const MARGIN_X = (PAGE_W - COLS * TAG_W) / 2;
const MARGIN_Y = (PAGE_H - ROWS * TAG_H) / 2;

export async function downloadNameTags(
  tags: NameTag[],
  options: { eventName?: string; fileName?: string } = {}
) {
  const doc = await buildNameTagsPdf(tags, options);
  doc.save(options.fileName ?? 'name-tags.pdf');
}

export async function buildNameTagsPdf(
  tags: NameTag[],
  options: { eventName?: string } = {}
) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const eventName = options.eventName ?? 'DevFest Ibadan 2026';
  const perPage = COLS * ROWS;

  tags.forEach((tag, i) => {
    if (i > 0 && i % perPage === 0) doc.addPage();
    const slot = i % perPage;
    const x = MARGIN_X + (slot % COLS) * TAG_W;
    const y = MARGIN_Y + Math.floor(slot / COLS) * TAG_H;

    doc.setDrawColor(200);
    doc.setLineDashPattern([1, 1], 0);
    doc.rect(x, y, TAG_W, TAG_H);
    doc.setLineDashPattern([], 0);

    // Google-colour strip
    const strip = [
      [66, 133, 244],
      [234, 67, 53],
      [251, 188, 4],
      [52, 168, 83],
    ];
    strip.forEach(([r, g, b], k) => {
      doc.setFillColor(r, g, b);
      doc.rect(x + (k * TAG_W) / 4, y, TAG_W / 4, 3, 'F');
    });

    doc.setTextColor(95, 99, 104);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(eventName, x + TAG_W / 2, y + 11, { align: 'center' });

    const name = tag.fullName.trim() || '—';
    const maxW = TAG_W - 12;
    let size = 24;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(size);
    while (size > 14 && doc.getTextWidth(name) > maxW) {
      size -= 1;
      doc.setFontSize(size);
    }
    doc.setTextColor(30, 30, 30);
    const lines = (doc.splitTextToSize(name, maxW) as string[]).slice(0, 2);
    const lineH = size * 0.42;
    const top = y + TAG_H / 2 - ((lines.length - 1) * lineH) / 2 + 2;
    lines.forEach((line, k) =>
      doc.text(line, x + TAG_W / 2, top + k * lineH, { align: 'center' })
    );

    if (tag.subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(66, 133, 244);
      doc.text(tag.subtitle, x + TAG_W / 2, y + TAG_H - 8, {
        align: 'center',
        maxWidth: maxW,
      });
    }
  });

  if (tags.length === 0) {
    doc.text('No attendees to print.', 20, 20);
  }
  return doc;
}
