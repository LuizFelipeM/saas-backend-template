import {
  ClerkClient,
  createClerkClient,
  User,
  verifyToken,
} from '@clerk/backend';
import type { JwtPayload } from '@clerk/types';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);
  private readonly clerkClient: ClerkClient;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.getOrThrow<string>('CLERK_SECRET_KEY');
    const publishableKey = this.configService.getOrThrow<string>(
      'CLERK_PUBLISHABLE_KEY',
    );

    this.clerkClient = createClerkClient({
      secretKey,
      publishableKey,
    });
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return (
      await this.clerkClient.users.getUserList({
        emailAddress: [email],
      })
    ).data[0];
  }

  async verify(token: string): Promise<JwtPayload> {
    try {
      return await verifyToken(token, {
        secretKey: this.configService.getOrThrow<string>('CLERK_SECRET_KEY'),
        authorizedParties: this.configService.get<string[]>(
          'CLERK_AUTHORIZED_PARTIES',
        ),
      });
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      return await this.clerkClient.users.getUser(userId);
    } catch (error) {
      throw new UnauthorizedException('User not found');
    }
  }
}
