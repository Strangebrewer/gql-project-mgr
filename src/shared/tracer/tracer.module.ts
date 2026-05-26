import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TracerConfig } from 'src/config/tracer';

type Span = {
  traceId: string;
  spanId: string;
  service: string;
  operation: string;
  status: 'ok' | 'error';
  startTime: Date;
  endTime: Date;
  error?: string;
  metaData?: Record<string, any>;
  parentSpanId?: string;
};

export type TracerClient = {
  send: (span: Span) => void;
  sendSpan: (
    traceId: string,
    operation: string,
    start: Date,
    end: Date,
    count?: number,
  ) => void;
  sendErrorSpan: (
    traceId: string,
    operation: string,
    errMsg: string,
    start: Date,
    end: Date,
  ) => void;
};

export const TRACER_CLIENT = 'TRACER_CLIENT';

export const tracerFactory = {
  provide: TRACER_CLIENT,
  useFactory: async (configSvc: ConfigService) => {
    const { service, serviceKey, url } = configSvc.get<TracerConfig>('tracer');

    async function send(span: Span) {
      fetch(url + '/spans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Service-Key': serviceKey,
        },
        body: JSON.stringify(span),
      });
    }

    async function sendSpan(
      traceId: string,
      operation: string,
      start: Date,
      end: Date,
      count?: number,
    ) {
      if (!traceId) return;
      const span: Span = {
        traceId,
        spanId: crypto.randomUUID(),
        service,
        operation,
        status: 'ok',
        startTime: start,
        endTime: end,
      };
      if (count || count === 0) span.metaData = { count };
      send(span);
    }

    async function sendErrorSpan(
      traceId: string,
      operation: string,
      errMsg: string,
      start: Date,
      end: Date,
    ) {
      if (!traceId) return;
      const span: Span = {
        traceId,
        spanId: crypto.randomUUID(),
        service,
        operation,
        status: 'error',
        error: errMsg,
        startTime: start,
        endTime: end,
      };
      send(span);
    }

    return {
      send,
      sendSpan,
      sendErrorSpan,
    };
  },
  inject: [ConfigService],
};

@Module({
  providers: [tracerFactory],
  exports: [TRACER_CLIENT],
})
export class TracerModule {}
