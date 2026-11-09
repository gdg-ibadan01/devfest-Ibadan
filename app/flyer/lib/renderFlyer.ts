import { google_sans } from '@/app/fonts';
import { SPONSORS_2026 } from '@/app/_module/data/sponsors.data';

export const FLYER_WIDTH = 1080;
export const FLYER_HEIGHT = 1350;
export const FLYER_URL = 'https://devfestibadan.com';
export const MAX_NAME_LENGTH = 24;

const COLORS = {
  bg: '#c8efc0',
  grid: 'rgba(60, 120, 60, 0.12)',
  pattern: '#8fbf8a',
  red: '#ea4335',
  yellow: '#f9ab00',
  blue: '#4285f4',
  green: '#34a853',
  pink: '#ff7daf',
  ribbon: '#f6a21e',
  footer: '#4c9a52',
  footerAccent: '#f3e9a0',
  ink: '#060606',
};

const FONT = google_sans.style.fontFamily;

const imageCache = new Map<string, Promise<HTMLImageElement | null>>();

function loadImage(src: string): Promise<HTMLImageElement | null> {
  let cached = imageCache.get(src);
  if (!cached) {
    cached = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
    imageCache.set(src, cached);
  }
  return cached;
}

/** Crop a logo to its visible pixels so transparent padding doesn't skew its size. */
async function loadTrimmedLogo(
  src: string
): Promise<HTMLCanvasElement | null> {
  const img = await loadImage(src);
  if (!img) return null;
  const scale = Math.min(1, 600 / img.naturalWidth);
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const full = document.createElement('canvas');
  full.width = w;
  full.height = h;
  const fctx = full.getContext('2d');
  if (!fctx) return null;
  fctx.drawImage(img, 0, 0, w, h);
  const { data } = fctx.getImageData(0, 0, w, h);
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 12) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return full;
  const tw = maxX - minX + 1;
  const th = maxY - minY + 1;
  const out = document.createElement('canvas');
  out.width = tw;
  out.height = th;
  out.getContext('2d')?.drawImage(full, minX, minY, tw, th, 0, 0, tw, th);
  return out;
}

function loadTintedSvg(src: string, color: string) {
  const key = `${src}#${color}`;
  let cached = imageCache.get(key);
  if (!cached) {
    cached = fetch(src)
      .then((res) => res.text())
      .then((svg) =>
        loadImage(
          `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
            svg.replace(/"white"/g, `"${color}"`)
          )}`
        )
      )
      .catch(() => null);
    imageCache.set(key, cached);
  }
  return cached;
}

async function ensureFonts() {
  if (typeof document === 'undefined' || !document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load(`700 40px ${FONT}`),
      document.fonts.load(`500 40px ${FONT}`),
      document.fonts.load(`400 40px ${FONT}`),
    ]);
  } catch {
    // Fall back to system fonts if the web font cannot load.
  }
}

/** Decode a user photo, honouring EXIF orientation from phone cameras. */
export async function decodePhoto(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    return await createImageBitmap(file);
  }
}

type Ctx = CanvasRenderingContext2D;

function drawCover(
  ctx: Ctx,
  img: CanvasImageSource,
  iw: number,
  ih: number,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const scale = Math.max(w / iw, h / ih);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (iw - sw) / 2;
  // Bias the crop upward so faces are not cut off in portrait photos.
  const sy = (ih - sh) * 0.3;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawContain(
  ctx: Ctx,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  maxW: number,
  maxH: number
) {
  const ratio = img.naturalWidth / img.naturalHeight;
  let w = maxW;
  let h = w / ratio;
  if (h > maxH) {
    h = maxH;
    w = h * ratio;
  }
  ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
  return w;
}

function fitText(
  ctx: Ctx,
  text: string,
  weight: number,
  maxWidth: number,
  startSize: number,
  minSize = 28
) {
  let size = startSize;
  while (size > minSize) {
    ctx.font = `${weight} ${size}px ${FONT}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  ctx.font = `${weight} ${size}px ${FONT}`;
  return size;
}

function drawBackground(ctx: Ctx) {
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, FLYER_WIDTH, FLYER_HEIGHT);

  // Perspective-style grid lines.
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 2;
  for (let y = 120; y < FLYER_HEIGHT; y += 150) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(FLYER_WIDTH, y);
    ctx.stroke();
  }
  for (let x = 0; x <= FLYER_WIDTH; x += 150) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, FLYER_HEIGHT);
    ctx.stroke();
  }
}

function drawPatterns(ctx: Ctx) {
  ctx.save();
  ctx.fillStyle = COLORS.pattern;
  ctx.strokeStyle = COLORS.pattern;
  ctx.lineWidth = 14;

  // Nested diamonds, top right.
  for (const r of [150, 105, 60]) {
    ctx.beginPath();
    ctx.moveTo(1010, 150 - r);
    ctx.lineTo(1010 + r, 150);
    ctx.lineTo(1010, 150 + r);
    ctx.lineTo(1010 - r, 150);
    ctx.closePath();
    ctx.stroke();
  }

  // Zigzag triangles, right edge.
  for (let i = 0; i < 3; i++) {
    const y = 340 + i * 70;
    ctx.beginPath();
    ctx.moveTo(1080, y);
    ctx.lineTo(1000, y + 35);
    ctx.lineTo(1080, y + 70);
    ctx.closePath();
    ctx.fill();
  }

  // Star burst, mid right.
  ctx.save();
  ctx.translate(1010, 590);
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-14, -75, 28, 150);
  }
  ctx.restore();

  // Chunky shapes, lower right.
  ctx.beginPath();
  ctx.arc(990, 790, 55, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(1000, 740, 80, 110);

  // Chevrons, bottom right.
  ctx.lineWidth = 16;
  ctx.lineJoin = 'miter';
  for (let i = 0; i < 3; i++) {
    const y = 930 + i * 45;
    ctx.beginPath();
    ctx.moveTo(900, y + 60);
    ctx.lineTo(990, y);
    ctx.lineTo(1080, y + 60);
    ctx.stroke();
  }
  ctx.restore();
}

function drawRedDots(ctx: Ctx) {
  for (const y of [575, 700, 827]) {
    ctx.beginPath();
    ctx.arc(187, y, 50, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.red;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = COLORS.ink;
    ctx.stroke();
  }
}

function drawHeadline(ctx: Ctx) {
  ctx.fillStyle = COLORS.ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `700 100px ${FONT}`;
  ctx.fillText('I will be', FLYER_WIDTH / 2, 235);
  ctx.font = `700 118px ${FONT}`;
  ctx.fillText('Attending', FLYER_WIDTH / 2, 340);
}

function drawSticker(ctx: Ctx) {
  ctx.save();
  ctx.translate(790, 455);
  ctx.rotate((-7 * Math.PI) / 180);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.lineJoin = 'round';

  const parts: Array<[string, number, number, number, string]> = [
    ['IBADAN', -130, -48, 26, COLORS.ink],
    ['Dev', -140, 10, 82, COLORS.ink],
    ['Fest', -95, 78, 82, COLORS.ink],
    ['2', 10, -30, 84, COLORS.blue],
    ['0', 62, -42, 84, COLORS.yellow],
    ['2', 42, 40, 84, COLORS.green],
    ['6', 92, 52, 96, COLORS.red],
  ];
  // Outline every part first so no outline cuts into a neighbouring letter.
  ctx.lineWidth = 16;
  ctx.strokeStyle = '#ffffff';
  for (const [text, x, y, size] of parts) {
    ctx.font = `700 ${size}px ${FONT}`;
    ctx.strokeText(text, x, y);
  }
  for (const [text, x, y, size, fill] of parts) {
    ctx.font = `700 ${size}px ${FONT}`;
    ctx.fillStyle = fill;
    ctx.fillText(text, x, y);
  }
  ctx.restore();
}

function drawPolaroid(
  ctx: Ctx,
  photo: ImageBitmap | null,
  name: string
) {
  const x = 287;
  const y = 375;
  const w = 493;
  const h = 595;
  const pad = 10;

  // Hard offset shadow + frame.
  ctx.fillStyle = COLORS.ink;
  ctx.fillRect(x + 10, y + 10, w, h);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, w, h);
  ctx.lineWidth = 5;
  ctx.strokeStyle = COLORS.ink;
  ctx.strokeRect(x, y, w, h);

  // Photo area.
  const px = x + pad;
  const py = y + pad;
  const pw = w - pad * 2;
  const ph = 480;
  ctx.save();
  ctx.beginPath();
  ctx.rect(px, py, pw, ph);
  ctx.clip();
  if (photo) {
    drawCover(ctx, photo, photo.width, photo.height, px, py, pw, ph);
  } else {
    ctx.fillStyle = '#b9cbd0';
    ctx.fillRect(px, py, pw, ph);
    // Placeholder silhouette.
    ctx.fillStyle = '#8fa6ad';
    ctx.beginPath();
    ctx.arc(px + pw / 2, py + 190, 85, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(px + pw / 2, py + ph + 10, 170, 190, 0, Math.PI, 0);
    ctx.fill();
  }
  ctx.restore();

  // Name label.
  const label = name.trim() || 'Your Name';
  ctx.fillStyle = name.trim() ? COLORS.ink : '#9a9a9a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fitText(ctx, label, 700, pw - 30, 76, 30);
  ctx.fillText(label, x + w / 2, py + ph + (h - pad - ph) / 2 + 2);
  ctx.textBaseline = 'alphabetic';
}

function drawRibbon(ctx: Ctx) {
  ctx.save();
  ctx.translate(FLYER_WIDTH / 2, 1060);
  ctx.rotate((6 * Math.PI) / 180);
  const bandH = 80;
  ctx.fillStyle = COLORS.ribbon;
  ctx.fillRect(-FLYER_WIDTH, -bandH / 2, FLYER_WIDTH * 2, bandH);

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  const segment = ['Nov 21st, 2026', 'Kakanfo inn,Ring road'];
  let cursor = -FLYER_WIDTH * 0.62;
  ctx.font = `500 34px ${FONT}`;
  while (cursor < FLYER_WIDTH) {
    for (const part of segment) {
      ctx.fillStyle = '#ffffff';
      ctx.font = `500 34px ${FONT}`;
      ctx.fillText(part, cursor, 2);
      cursor += ctx.measureText(part).width + 40;
      // Diamond separator.
      ctx.fillStyle = COLORS.footer;
      ctx.beginPath();
      ctx.moveTo(cursor, -14);
      ctx.lineTo(cursor + 14, 0);
      ctx.lineTo(cursor, 14);
      ctx.lineTo(cursor - 14, 0);
      ctx.closePath();
      ctx.fill();
      cursor += 54;
    }
  }
  ctx.restore();
}

function roundedRect(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function drawSponsors(ctx: Ctx) {
  const boxX = 110;
  const boxW = FLYER_WIDTH - boxX * 2;
  const boxY = 1128;
  const boxH = 74;

  // Outer pill.
  roundedRect(ctx, boxX, boxY, boxW, boxH, 37);
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = COLORS.blue;
  ctx.stroke();

  // Caption tab.
  const caption = 'Our Proud sponsors and partners';
  ctx.font = `500 17px ${FONT}`;
  const capW = ctx.measureText(caption).width + 40;
  roundedRect(ctx, FLYER_WIDTH / 2 - capW / 2, boxY - 24, capW, 32, 12);
  ctx.fillStyle = COLORS.bg;
  ctx.fill();
  ctx.strokeStyle = COLORS.blue;
  ctx.stroke();
  ctx.fillStyle = '#3c3c3c';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(caption, FLYER_WIDTH / 2, boxY - 7);
  ctx.textBaseline = 'alphabetic';

  const logos = (
    await Promise.all(
      SPONSORS_2026.map((sp) => loadTrimmedLogo(`/sponsors/${sp.logo}`))
    )
  ).filter((c): c is HTMLCanvasElement => c !== null);
  if (!logos.length) return;

  // Every logo gets the same height; one shared scale keeps them equal if the row is too wide.
  const targetH = 38;
  const gap = 44;
  const widths = logos.map((c) => (c.width / c.height) * targetH);
  const total = widths.reduce((a, b) => a + b, 0) + gap * (logos.length - 1);
  const scale = Math.min(1, (boxW - 60) / total);
  const h = targetH * scale;
  let cursor = FLYER_WIDTH / 2 - (total * scale) / 2;
  logos.forEach((c, i) => {
    const w = widths[i] * scale;
    ctx.drawImage(c, cursor, boxY + boxH / 2 - h / 2, w, h);
    cursor += w + gap * scale;
  });
}

function drawShapeRow(ctx: Ctx) {
  const baseY = 1250;
  const shapes: Array<[string, string, number]> = [
    ['tri', COLORS.red, 30],
    ['tri', COLORS.red, 190],
    ['rect', COLORS.yellow, 250],
    ['rect', COLORS.yellow, 345],
    ['para', COLORS.blue, 470],
    ['para', COLORS.blue, 580],
    ['rect', COLORS.green, 670],
    ['rect', COLORS.green, 765],
    ['tri', COLORS.pink, 885],
    ['tri', COLORS.pink, 1030],
  ];
  for (const [kind, color, x] of shapes) {
    ctx.fillStyle = color;
    ctx.beginPath();
    if (kind === 'tri') {
      ctx.moveTo(x - 40, baseY);
      ctx.lineTo(x, baseY - 32);
      ctx.lineTo(x + 40, baseY);
    } else if (kind === 'rect') {
      ctx.rect(x, baseY - 36, 66, 36);
    } else {
      ctx.moveTo(x, baseY);
      ctx.lineTo(x + 20, baseY - 36);
      ctx.lineTo(x + 85, baseY - 36);
      ctx.lineTo(x + 65, baseY);
    }
    ctx.closePath();
    ctx.fill();
  }
}

function drawFooter(ctx: Ctx) {
  const y = 1250;
  ctx.fillStyle = COLORS.footer;
  ctx.fillRect(0, y, FLYER_WIDTH, FLYER_HEIGHT - y);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = COLORS.footerAccent;
  ctx.font = `500 32px ${FONT}`;
  ctx.fillText('Get your ticket:', FLYER_WIDTH / 2, y + 38);
  ctx.fillStyle = '#ffffff';
  ctx.font = `500 40px ${FONT}`;
  ctx.fillText(FLYER_URL, FLYER_WIDTH / 2, y + 82);
}

async function drawLogo(ctx: Ctx) {
  // The source SVG draws its wordmark in white; recolour it for the light background.
  const logo = await loadTintedSvg('/gdg_logo.svg', '#3c3c3c');
  if (logo) drawContain(ctx, logo, 215, 120, 260, 85);
}

export interface FlyerInput {
  name: string;
  photo: ImageBitmap | null;
}

/** Draw the full flyer onto the given canvas (resized to 1080×1350). */
export async function renderFlyer(
  canvas: HTMLCanvasElement,
  { name, photo }: FlyerInput
) {
  canvas.width = FLYER_WIDTH;
  canvas.height = FLYER_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not supported in this browser.');

  await ensureFonts();

  drawBackground(ctx);
  drawPatterns(ctx);
  drawRedDots(ctx);
  await drawLogo(ctx);
  drawHeadline(ctx);
  drawPolaroid(ctx, photo, name);
  drawSticker(ctx);
  drawRibbon(ctx);
  await drawSponsors(ctx);
  drawShapeRow(ctx);
  drawFooter(ctx);
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Export failed'))),
      'image/png'
    );
  });
}
