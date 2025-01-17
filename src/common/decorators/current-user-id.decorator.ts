import { JwtPayload } from '@clerk/types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator<string>(
  (_: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
      const jwt: JwtPayload = ctx.switchToHttp().getRequest().jwt;
      return jwt.sub;
    }

    throw new Error(`Unsupported ${ctx.getType()} request type`);
  },
);
