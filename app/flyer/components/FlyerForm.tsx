'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Copy,
  Download,
  ImagePlus,
  Image as ImageIcon,
  Share2,
  Smartphone,
} from 'lucide-react';
import { showToast } from '@/app/_module/lib/notify';
import {
  trackFlyerDownloaded,
  trackFlyerGenerated,
} from '@/utils/google-analytics';
import {
  MAX_NAME_LENGTH,
  canvasToBlob,
  decodePhoto,
  renderFlyer,
} from '../lib/renderFlyer';

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const SITE_URL = 'https://devfestibadan.com';
const SHARE_TITLE = 'I will be attending DevFest Ibadan 2026';
const CAPTION = `I will be attending DevFest Ibadan 2026! Get your ticket: ${SITE_URL} #DevFestIbadan #DevFest2026`;

const SOCIAL_LINKS = [
  {
    key: 'x',
    label: 'Post on X',
    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(CAPTION)}`,
  },
  {
    key: 'whatsapp',
    label: 'Send on WhatsApp',
    href: `https://wa.me/?text=${encodeURIComponent(CAPTION)}`,
  },
  {
    key: 'linkedin',
    label: 'Share on LinkedIn',
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}`,
  },
] as const;

function flyerFileName(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `devfest-ibadan-2026-${slug || 'attendee'}.png`;
}

const MENU_ITEM =
  'w-full flex items-center gap-[10px] px-[14px] py-[12px] text-left text-[15px] font-medium text-[#1E1E1E] hover:bg-black/5 cursor-pointer focus:outline-none focus-visible:bg-black/5';

export default function FlyerForm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shareWrapRef = useRef<HTMLDivElement>(null);
  const flyerFile = useRef<File | null>(null);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<ImageBitmap | null>(null);
  const [photoName, setPhotoName] = useState('');
  // The inputs the current PNG was built from; buttons stay disabled until it matches.
  const [built, setBuilt] = useState<{ name: string; photo: ImageBitmap | null } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [canShareFile, setCanShareFile] = useState(false);
  const [canCopyImage, setCanCopyImage] = useState(false);
  const generatedTracked = useRef(false);
  const renderId = useRef(0);

  // Re-render the preview whenever the inputs change, then pre-build the PNG
  // so Share can call navigator.share() synchronously inside the click.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const id = ++renderId.current;
    flyerFile.current = null;
    setCanShareFile(false);
    renderFlyer(canvas, { name, photo })
      .then(async () => {
        if (id !== renderId.current || !photo || !name.trim()) return;
        const blob = await canvasToBlob(canvas);
        if (id !== renderId.current) return;
        const file = new File([blob], flyerFileName(name), {
          type: 'image/png',
        });
        flyerFile.current = file;
        setBuilt({ name, photo });
        setCanShareFile(
          typeof navigator.share === 'function' &&
            Boolean(navigator.canShare?.({ files: [file] }))
        );
      })
      .catch(() => showToast.error('Could not draw your flyer. Please retry.'));
  }, [name, photo]);

  useEffect(() => {
    setCanCopyImage(
      typeof ClipboardItem !== 'undefined' &&
        typeof navigator.clipboard?.write === 'function'
    );
  }, []);

  // Close the share menu on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (!shareWrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!photo || !name.trim() || generatedTracked.current) return;
    generatedTracked.current = true;
    trackFlyerGenerated();
  }, [photo, name]);

  const onPhotoChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;
      if (!ACCEPTED_TYPES.includes(file.type)) {
        showToast.error('Please choose a JPG, PNG or WebP image.');
        return;
      }
      if (file.size > MAX_PHOTO_BYTES) {
        showToast.error('That photo is too large. Please use one under 10MB.');
        return;
      }
      try {
        const bitmap = await decodePhoto(file);
        setPhoto((prev) => {
          prev?.close();
          return bitmap;
        });
        setPhotoName(file.name);
      } catch {
        showToast.error('We could not read that image. Try another one.');
      }
    },
    []
  );

  const ready = Boolean(photo && name.trim());
  const fileReady = built?.name === name && built?.photo === photo;
  const disabled = !ready || !fileReady;

  const onDownload = async () => {
    try {
      const file = flyerFile.current;
      if (!file) throw new Error('Flyer not ready');
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      trackFlyerDownloaded('download');
      showToast.success('Flyer downloaded. Attach it to your post!');
    } catch {
      showToast.error('Download failed. Please try again.');
    }
  };

  // Opens the device share sheet with the image. Must run straight from a click.
  const shareNatively = async () => {
    const file = flyerFile.current;
    if (!file) return;
    try {
      await navigator.share({ files: [file], title: SHARE_TITLE, text: CAPTION });
      trackFlyerDownloaded('share');
      setMenuOpen(false);
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return; // user cancelled
      showToast.error(
        'Your browser could not open the share sheet. Use one of the options below.'
      );
      setMenuOpen(true);
    }
  };

  const onShare = () => {
    // Phones and tablets: go straight to the native share sheet (with the image).
    const touchDevice = window.matchMedia?.('(pointer: coarse)').matches;
    if (touchDevice && canShareFile) {
      void shareNatively();
      return;
    }
    // Desktop browsers: show clear choices instead of an invisible/no-op share.
    setMenuOpen((open) => !open);
  };

  // Lets people paste the flyer straight into X, LinkedIn, WhatsApp Web, etc.
  const onCopyImage = async () => {
    const file = flyerFile.current;
    if (!file) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': file })]);
      trackFlyerDownloaded('copy_image');
      showToast.success('Flyer copied. Paste it into your post (Ctrl/⌘ + V).');
    } catch {
      showToast.error('Could not copy the image. Download it instead.');
    }
    setMenuOpen(false);
  };

  const onCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(CAPTION);
      trackFlyerDownloaded('copy');
      showToast.success('Caption copied. Paste it into your post!');
    } catch {
      showToast.error('Could not copy. Please select and copy it manually.');
    }
    setMenuOpen(false);
  };

  const onSocial = (key: string) => {
    trackFlyerDownloaded(key as 'x' | 'whatsapp' | 'linkedin');
    showToast.info(
      canCopyImage
        ? 'Use "Copy image" and paste it into your post.'
        : 'Download your flyer and attach it to the post.'
    );
    setMenuOpen(false);
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto px-[16px] md:px-[32px] py-[40px] md:py-[64px] grid gap-[32px] md:grid-cols-[1fr_420px] items-start">
      <div className="flex flex-col gap-[24px] order-2 md:order-1">
        <div>
          <h1 className="text-[28px] md:text-[40px] font-bold text-[#1E1E1E] leading-tight">
            Create your &ldquo;I will be attending&rdquo; flyer
          </h1>
          <p className="mt-[12px] text-[15px] text-[#515151]">
            Add your name and photo, then download your DevFest Ibadan 2026
            flyer and share it. Your photo stays on your device.
          </p>
        </div>

        <label className="flex flex-col gap-[8px] text-[14px] font-medium text-[#1E1E1E]">
          Your name
          <input
            type="text"
            value={name}
            maxLength={MAX_NAME_LENGTH}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Monsur"
            className="h-[48px] rounded-[12px] border border-gray-300 bg-white px-[16px] text-[16px] focus:outline-none focus:ring-2 focus:ring-core-blue"
          />
        </label>

        <div className="flex flex-col gap-[8px] text-[14px] font-medium text-[#1E1E1E]">
          Your photo
          <label className="flex items-center gap-[12px] h-[48px] rounded-[12px] border border-dashed border-gray-400 bg-white px-[16px] cursor-pointer hover:border-core-blue">
            <ImagePlus className="w-[20px] h-[20px] shrink-0" />
            <span className="truncate text-[15px] font-normal text-[#515151]">
              {photoName || 'Upload a JPG, PNG or WebP (max 10MB)'}
            </span>
            <input
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              onChange={onPhotoChange}
              className="sr-only"
            />
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-[12px]">
          <button
            type="button"
            onClick={onDownload}
            disabled={disabled}
            className="flex-1 flex items-center justify-center gap-[10px] bg-[#1E1E1E] hover:bg-core-blue disabled:bg-gray-400 text-white py-[16px] rounded-[100px] font-bold transition-all text-[16px] disabled:cursor-not-allowed cursor-pointer focus:outline-none"
          >
            <Download className="w-[16px] h-[16px]" />
            Download flyer
          </button>
          <div ref={shareWrapRef} className="relative flex-1 flex flex-col">
            <button
              type="button"
              onClick={onShare}
              disabled={disabled}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="w-full flex items-center justify-center gap-[10px] border-2 border-[#1E1E1E] hover:bg-black/5 disabled:opacity-40 text-[#1E1E1E] py-[14px] rounded-[100px] font-bold transition-all text-[16px] disabled:cursor-not-allowed cursor-pointer focus:outline-none"
            >
              <Share2 className="w-[16px] h-[16px]" />
              Share
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute left-[0px] top-full mt-[8px] w-full min-w-[260px] z-20 overflow-hidden rounded-[16px] border border-gray-200 bg-white shadow-xl"
              >
                {canShareFile && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={shareNatively}
                    className={MENU_ITEM}
                  >
                    <Smartphone className="w-[16px] h-[16px]" />
                    Share with your device…
                  </button>
                )}
                {canCopyImage && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={onCopyImage}
                    className={MENU_ITEM}
                  >
                    <ImageIcon className="w-[16px] h-[16px]" />
                    Copy image
                  </button>
                )}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    void onDownload();
                  }}
                  className={MENU_ITEM}
                >
                  <Download className="w-[16px] h-[16px]" />
                  Download image
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={onCopyCaption}
                  className={MENU_ITEM}
                >
                  <Copy className="w-[16px] h-[16px]" />
                  Copy caption
                </button>
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.key}
                    role="menuitem"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onSocial(link.key)}
                    className={`${MENU_ITEM} border-t border-gray-100`}
                  >
                    {link.label}
                  </a>
                ))}
                <p className="px-[14px] py-[10px] text-[12px] text-[#515151] bg-[#FAF8F5]">
                  Social sites can&rsquo;t take an image from a link. Copy or
                  download the flyer, then add it to your post.
                </p>
              </div>
            )}
          </div>
        </div>
        {!ready && (
          <p className="text-[13px] text-[#515151] -mt-[12px]">
            Add your name and photo to enable download.
          </p>
        )}
      </div>

      <div className="order-1 md:order-2 w-full max-w-[420px] mx-auto md:mx-0">
        <canvas
          ref={canvasRef}
          aria-label="Flyer preview"
          className="w-full h-auto rounded-[16px] shadow-xl border border-gray-100"
          style={{ aspectRatio: '1080 / 1350' }}
        />
      </div>
    </div>
  );
}
