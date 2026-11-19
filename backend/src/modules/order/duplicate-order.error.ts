import { HttpException, HttpStatus } from '@nestjs/common';
import { ServiceError } from 'src/common/errors/service-error';

/**
 * Thrown when the buyer already has a paid or unexpired order for the ticket.
 * `pendingReference` is set only when that order is still unpaid and was
 * started by the same payer, so the client can send them back to finish it.
 */
export class DuplicateOrderError extends ServiceError {
  constructor(
    message: string,
    public readonly pendingReference: string | null = null,
  ) {
    super(message, 'DuplicateErr');
  }
}

/** 409 body for a duplicate order, carrying `pendingReference` when resumable. */
export function duplicateOrderConflict(err: Error): HttpException {
  const pendingReference =
    err instanceof DuplicateOrderError ? err.pendingReference : null;
  return new HttpException(
    {
      statusCode: HttpStatus.CONFLICT,
      message: err.message,
      error: 'Conflict',
      ...(pendingReference && { pendingReference }),
    },
    HttpStatus.CONFLICT,
  );
}
