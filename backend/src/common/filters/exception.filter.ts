import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Implement custom response logic for exceptions.
 * This filter will change the servers exception response
 * structure before sending it to client
 */

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  /** Catch the incoming exception */
  catch(exception: HttpException, host: ArgumentsHost) {
    /** Extracting the HTTP response object from host object */
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();

    /** Retrieves the HTTP status code from the response */
    const statusCode: number = exception.getStatus();

    /** Retrieve the exception's response message */
    const exceptionResponse: string | object = exception.getResponse();

    let message: string = '';
    /** Extra fields a handler put on the response (e.g. `pendingReference`) */
    let extras: Record<string, unknown> = {};

    /** Check if the response is an object or a string */
    if (typeof exceptionResponse === 'string') {
      /** Handle case where the response is a string */
      message = exceptionResponse;
    } else if (
      /** Check if the data is and object with a message property */
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      /** Handle case where the response is an object */
      const {
        message: objectMessage,
        statusCode: _statusCode,
        error: _error,
        ...rest
      } = exceptionResponse as Record<string, unknown>;
      message = objectMessage as string;
      extras = rest;
    }

    /**
     * 500s carry raw internal errors (Prisma messages with file paths, etc.)
     * from the controllers' `default:` branches. Log them, never send them.
     */
    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(message);
      message = 'Something went wrong on our side. Please try again.';
      extras = {};
    }

    /** return a custom response object to client */
    response.status(statusCode).json({
      // statusCode,
      success: false,
      message,
      ...extras,
      // timestamp: new Date().toISOString(),
    });
  }
}
