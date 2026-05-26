import {
  Inject,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TRACER_CLIENT, TracerClient } from '../../shared/tracer/tracer.module';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class TraceInterceptor implements NestInterceptor {
  constructor(@Inject(TRACER_CLIENT) private readonly tracer: TracerClient) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = new Date();
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const args = ctx.getArgs();
    const fieldName = ctx.getInfo().fieldName;
    const resourceId = args?.id ?? undefined;
    const op = resourceId ? `${fieldName}:${resourceId}` : fieldName;
    const traceId = req.headers['x-trace-id'];
    return next.handle().pipe(
      tap(() => {
        this.tracer.sendSpan(traceId, op, start, new Date());
      }),
      catchError((err) => {
        this.tracer.sendErrorSpan(traceId, op, err.message, start, new Date());
        throw err;
      }),
    );
  }
}
