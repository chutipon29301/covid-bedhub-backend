import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as Sentry from '@sentry/minimal';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
        exception => {
          if (!(exception instanceof HttpException)) {
            Sentry.captureException(exception);
          }
        },
      ),
    );
  }
}
