import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Implement custom response logic for exceptions.
 * This filter will change the servers exception response
 * structure before sending it to client
 */

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
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
      message = (exceptionResponse as { message: string }).message;
    }

    /** return a custom response object to client */
    response.status(statusCode).json({
      statusCode,
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
