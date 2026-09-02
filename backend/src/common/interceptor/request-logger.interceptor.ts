import {
  CallHandler,
  ExecutionContext,
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
        error: (_err) => {
          this.logRequest(request, response, startTime);
        },
      }),
    );
  }

  private logRequest(
    request: Request,
    response: Response,
    startTime: number,
  ): void {
    const responseTime = Date.now() - startTime;
    const { method, originalUrl } = request;
    const statusCode = response.statusCode;

    const message = `[${new Date().toISOString()}] [${request['requestId']}] ${method} ${originalUrl} ${statusCode} ${responseTime}ms`;

    if (statusCode >= 500) {
      this.logger.error(message);
    } else if (statusCode >= 400) {
      this.logger.warn(message);
    } else {
      this.logger.log(message);
    }
  }
}
