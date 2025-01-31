import { JwtPayload } from '@clerk/types';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationService } from '../../authentication/authentication.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly authenticationService: AuthenticationService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    try {
      const jwt = await this.authenticationService.verify(
        this.getAuthorization(ctx),
      );

      this.addJWT(ctx, jwt);
      return true;
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException();
    }
  }

  private getAuthorization(ctx: ExecutionContext): string {
    if (ctx.getType() === 'http') {
      const req = ctx.switchToHttp().getRequest();
      return (
        req.headers['authorization']?.split(' ')[1] ??
        req.headers['Authorization']?.split(' ')[1] ??
        req.cookie?.__session
      );
    }

    throw new Error(`Unsupported ${ctx.getType()} request type`);
  }

  private addJWT(ctx: ExecutionContext, jwt: JwtPayload): void {
    if (ctx.getType() === 'http') {
      ctx.switchToHttp().getRequest().jwt = jwt;
      return;
    }

    throw new Error(`Unsupported ${ctx.getType()} request type`);
  }
}
