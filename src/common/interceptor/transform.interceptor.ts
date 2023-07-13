import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from '@/utils/log4js';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgByIndex(1).req;
    const start = Date.now();
    return next.handle().pipe(
      map((data) => {
        const logFormat = ` RequestUrl: ${req.originalUrl}, Method: ${req.method}, IP: ${req.ip}, UserId: ${
          req.user ? req.user.id : null
        }
  Body: ${JSON.stringify(req.body)}
  Response: ${JSON.stringify(data)}
  Time: ${Date.now() - start}ms`;

        Logger.info(logFormat);
        return data;
      }),
    );
  }
}
