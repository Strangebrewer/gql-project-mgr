import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const TraceId = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const req = GqlExecutionContext.create(context).getContext().req;
    return req.headers['x-trace-id'];
  },
);
