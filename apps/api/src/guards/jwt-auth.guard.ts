import { JwtPayload } from '@clerk/types';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AUTHENTICATION_SERVICE_NAME,
  AuthenticationServiceClient,
  SERVICES_PACKAGE_NAME,
} from '@protos/authentication.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private authenticationServiceClient: AuthenticationServiceClient;

  constructor(
    @Inject(SERVICES_PACKAGE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authenticationServiceClient =
      this.client.getService<AuthenticationServiceClient>(
        AUTHENTICATION_SERVICE_NAME,
      );
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    try {
      const jwt = await firstValueFrom(
        this.authenticationServiceClient.verify({
          token: this.getAuthorization(ctx),
        }),
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

    if (ctx.getType() === 'rpc') {
      const req = ctx.switchToRpc().getData();
      return req.jwt;
    }

    throw new Error(`Unsupported ${ctx.getType()} request type`);
  }

  private addJWT(ctx: ExecutionContext, jwt: JwtPayload): void {
    if (ctx.getType() === 'http') {
      ctx.switchToHttp().getRequest().jwt = jwt;
      return;
    }

    if (ctx.getType() === 'rpc') {
      ctx.switchToRpc().getData().jwt = jwt;
      return;
    }

    throw new Error(`Unsupported ${ctx.getType()} request type`);
  }
}
