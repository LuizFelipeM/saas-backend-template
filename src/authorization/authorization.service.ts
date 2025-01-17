import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IResource, IUser, Permit } from 'permitio';

@Injectable()
export class AuthorizationService {
  private readonly logger = new Logger(AuthorizationService.name);
  private readonly permit: Permit;

  constructor(private readonly configService: ConfigService) {
    this.permit = new Permit({
      pdp: this.configService.get<string>('PERMITIO_PDP'),
      token: this.configService.get<string>('PERMITIO_SECRET_KEY'),
    });
  }

  async check(
    user: string | IUser,
    action: string,
    resource: string | IResource,
  ): Promise<boolean> {
    return await this.permit.check(user, action, resource);
  }
}
