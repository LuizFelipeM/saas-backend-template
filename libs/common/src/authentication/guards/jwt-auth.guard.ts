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
} from '@protos/authentication.service';
import { firstValueFrom } from 'rxjs';
import { GRPC_SERVICES } from '../../grpc/grpc.services';

@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private authenticationServiceClient: AuthenticationServiceClient;

  constructor(
    @Inject(GRPC_SERVICES)
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
      const { authorized, token } = await firstValueFrom(
        this.authenticationServiceClient.verify({
          token: this.getAuthorization(ctx),
        }),
      );

      if (!authorized) return false;

      this.addJWT(ctx, token);
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

  private addJWT(ctx: ExecutionContext, jwt: { [key: string]: string }): void {
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
