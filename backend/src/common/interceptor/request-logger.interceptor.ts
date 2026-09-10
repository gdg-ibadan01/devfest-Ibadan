import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const requestId = uuidv4();
    const startTime = Date.now();

    request['requestId'] = requestId;
    response.setHeader('X-Request-Id', requestId);

    return next.handle().pipe(
      tap({
        next: () => {
          this.logRequest(request, response, startTime);
        },
        error: (err) => {
          const statusCode =
            err instanceof HttpException
              ? err.getStatus()
              : response.statusCode;
          this.logRequest(request, response, startTime, statusCode);
        },
      }),
    );
  }

  private logRequest(
    request: Request,
    response: Response,
    startTime: number,
    statusCode?: number,
  ): void {
    const responseTime = Date.now() - startTime;
    const { method, originalUrl } = request;
    const status = statusCode ?? response.statusCode;

    const message = `[${new Date().toISOString()}] [${request['requestId']}] ${method} ${originalUrl} ${status} ${responseTime}ms`;

    if (status >= 500) {
      this.logger.error(message);
      return;
    }

    if (status >= 400) {
      this.logger.warn(message);
      return;
    }

    this.logger.log(message);
  }
}
