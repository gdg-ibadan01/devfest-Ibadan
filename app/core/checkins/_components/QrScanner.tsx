'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CameraOff, Loader2, RefreshCw } from 'lucide-react';

/**
 * Camera QR reader. Uses the native BarcodeDetector where the browser has it
 * (Chrome/Android) and falls back to jsQR on a downscaled frame (iOS Safari,
 * Firefox). Calls `onScan` once per distinct code; the same code is ignored
 * for `repeatDelayMs` so a ticket held in front of the camera isn't
 * submitted over and over.
 */
interface QrScannerProps {
  onScan: (text: string) => void;
  /** Stop decoding while the parent is busy with the last scan. */
  paused?: boolean;
  repeatDelayMs?: number;
}

type DetectorLike = {
  detect: (source: CanvasImageSource) => Promise<{ rawValue: string }[]>;
};

type CameraState = 'starting' | 'ready' | 'denied' | 'unavailable';

const SCAN_INTERVAL_MS = 180;
const MAX_FRAME_WIDTH = 640;

export default function QrScanner({
  onScan,
  paused = false,
  repeatDelayMs = 4000,
}: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastRef = useRef<{ text: string; at: number }>({ text: '', at: 0 });
  const pausedRef = useRef(paused);
  const onScanRef = useRef(onScan);
  const [state, setState] = useState<CameraState>('starting');
  const [attempt, setAttempt] = useState(0);

  pausedRef.current = paused;
  onScanRef.current = onScan;

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let detector: DetectorLike | null = null;
    let jsQR: typeof import('jsqr').default | null = null;

    const emit = (text: string) => {
      const now = Date.now();
      const last = lastRef.current;
      if (text === last.text && now - last.at < repeatDelayMs) return;
      lastRef.current = { text, at: now };
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.(80);
      }
      onScanRef.current(text);
    };

    const decodeFrame = async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || !video.videoWidth) return;

      if (detector) {
        const codes = await detector.detect(video);
        if (codes[0]?.rawValue) emit(codes[0].rawValue);
        return;
      }
      if (!jsQR) return;

      const scale = Math.min(1, MAX_FRAME_WIDTH / video.videoWidth);
      const w = Math.round(video.videoWidth * scale);
      const h = Math.round(video.videoHeight * scale);
      const canvas = (canvasRef.current ??= document.createElement('canvas'));
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, w, h);
      const image = ctx.getImageData(0, 0, w, h);
      const code = jsQR(image.data, w, h, { inversionAttempts: 'dontInvert' });
      if (code?.data) emit(code.data);
    };

    const loop = async () => {
      if (cancelled) return;
      if (!pausedRef.current) {
        try {
          await decodeFrame();
        } catch {
          // A single bad frame is not fatal; keep scanning.
        }
      }
      timer = setTimeout(loop, SCAN_INTERVAL_MS);
    };

    const start = async () => {
      setState('starting');
      if (!navigator.mediaDevices?.getUserMedia) {
        setState('unavailable');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play().catch(() => undefined);
        }

        const Native = (
          window as unknown as {
            BarcodeDetector?: new (o: { formats: string[] }) => DetectorLike;
          }
        ).BarcodeDetector;
        if (Native) {
          try {
            detector = new Native({ formats: ['qr_code'] });
          } catch {
            detector = null;
          }
        }
        if (!detector) jsQR = (await import('jsqr')).default;

        setState('ready');
        loop();
      } catch (err) {
        const name = (err as { name?: string })?.name;
        setState(
          name === 'NotAllowedError' || name === 'SecurityError'
            ? 'denied'
            : 'unavailable'
        );
      }
    };

    start();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      stop();
    };
  }, [attempt, repeatDelayMs, stop]);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-[14px] bg-black sm:aspect-video">
      <video
        ref={videoRef}
        muted
        playsInline
        autoPlay
        className="h-full w-full object-cover"
      />

      {state === 'ready' && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[62%] aspect-square rounded-2xl border-[3px] border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
        </div>
      )}

      {state === 'starting' && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 text-[13px] text-white/80">
          <Loader2 size={16} className="animate-spin" /> Starting camera…
        </div>
      )}

      {(state === 'denied' || state === 'unavailable') && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-white">
          <CameraOff size={28} />
          <p className="text-[14px] font-semibold">
            {state === 'denied'
              ? 'Camera permission was blocked'
              : 'No camera available'}
          </p>
          <p className="max-w-[320px] text-[12px] text-white/70">
            {state === 'denied'
              ? 'Allow camera access for this site in your browser settings, then retry. You can still type ticket codes below.'
              : 'Use a phone or laptop with a camera (the page must be on https), or type ticket codes below.'}
          </p>
          <button
            type="button"
            onClick={() => setAttempt((n) => n + 1)}
            className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2 text-[13px] font-semibold text-gray-900"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}
    </div>
  );
}
