import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 30;
const MAX_TRACKED_IPS = 10_000;

/**
 * Small per-instance limiter for public checkout endpoints, so they can't be
 * used to hammer the payment gateways. Keyed by caller IP AND order
 * reference: the Next.js proxy calls the API server-to-server, so many
 * shoppers can share one IP, but each has their own order reference.
 * In-memory on purpose (no new dependency).
 */
@Injectable()
export class IpRateLimitGuard implements CanActivate {
  private readonly hits = new Map<string, { count: number; resetAt: number }>();

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const forwarded = req.headers['x-forwarded-for'];
    const ip =
      (Array.isArray(forwarded) ? forwarded[0] : forwarded)
        ?.split(',')[0]
        ?.trim() ||
      req.ip ||
      'unknown';
    const body = req.body as { reference?: unknown } | undefined;
    const reference =
      typeof body?.reference === 'string' ? body.reference.slice(0, 100) : '';
    const key = `${ip}:${req.path}:${reference}`;
    const now = Date.now();

    if (this.hits.size > MAX_TRACKED_IPS) {
      for (const [k, v] of this.hits) if (v.resetAt <= now) this.hits.delete(k);
    }

    const entry = this.hits.get(key);
    if (!entry || entry.resetAt <= now) {
      this.hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
      return true;
    }
    entry.count += 1;
    if (entry.count > MAX_REQUESTS_PER_WINDOW) {
      throw new HttpException(
        'Too many requests. Please wait a moment and try again.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return true;
  }
}
