// src/common/interceptors/transformer.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((result) => {
        const statusCode: number = response.statusCode ?? 200;
        const method: string = (request?.method ?? 'GET').toUpperCase();

        if (result && typeof result === 'object') {
          const hasMessage = 'message' in result;
          const hasData = 'data' in result;

          if (hasMessage || hasData) {
            const message =
              result.message ?? this._defaultMessage(method, result);
            const data = result.data ?? this._stripMessage(result);
            return {
              statusCode,
              success: true,
              message,
              data,
            };
          }
        }

        if (typeof result === 'string') {
          return {
            statusCode,
            success: true,
            message: result,
          };
        }

        const message = this._defaultMessage(method, result);
        return {
          statusCode,
          success: true,
          message,
          data: result,
        };
      }),
    );
  }

  private _defaultMessage(method: string, data: any): string {
    switch (method) {
      case 'POST':
        return this._guessCreateMessage(data);
      case 'PUT':
      case 'PATCH':
        return 'Resource updated successfully';
      case 'DELETE':
        return 'Resource deleted successfully';
      case 'GET':
      default:
        return 'Request successful';
    }
  }

  private _guessCreateMessage(data: any): string {
    if (data && typeof data === 'object') {
      if ('fullName' in data) return 'Attendee created successfully';
      if ('title' in data) return 'Event created successfully';
      if ('transactionId' in data || 'amount' in data)
        return 'Payment processed successfully';
      if ('ticketNumber' in data || 'ticketType' in data)
        return 'Ticket created successfully';
      if ('username' in data || 'role' in data)
        return 'Admin created successfully';
      if ('email' in data && !('fullName' in data))
        return 'Resource created successfully';
      return 'Resource created successfully';
    }
    return 'Resource created successfully';
  }

  private _stripMessage(obj: Record<string, any>) {
    const { message, ...rest } = obj;
    return rest;
  }
}
