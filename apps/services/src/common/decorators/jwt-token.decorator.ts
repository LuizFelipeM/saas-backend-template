import { JwtPayload } from '@clerk/types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JwtToken = createParamDecorator<JwtPayload>(
  (_: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
      return ctx.switchToHttp().getRequest().jwt;
    }

    throw new Error(`Unsupported ${ctx.getType()} request type`);
  },
);
