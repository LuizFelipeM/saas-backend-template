import { WebhookEvent } from '@clerk/backend';
import {
  BadRequestException,
  Injectable,
  Logger,
  RawBodyRequest,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Webhook } from 'svix';
import { UsersService } from '../users.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private readonly clerkWebhook: Webhook;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    this.clerkWebhook = new Webhook(
      this.configService.getOrThrow<string>('CLERK_SIGNING_SECRET'),
    );
  }

  async processEvent(request: RawBodyRequest<Request>): Promise<void> {
    try {
      const event = this.clerkWebhook.verify(
        request.rawBody.toString('utf8'),
        request.headers as Record<string, string>,
      ) as WebhookEvent;

      if (event.type === 'user.created') {
        const organizationId = event.data.organization_memberships?.[0]?.id;
        if (!organizationId) return;

        const userId = event.data.id;
        const email = event.data.primary_email_address_id;

        await this.usersService.sync({
          userId,
          organizationId,
          email,
        });
      }

      if (event.type === 'user.deleted') {
        const userId = event.data.id;
        const organization =
          await this.usersService.getUserOrganization(userId);
        await this.usersService.revokePermissions(userId, organization.id);
      }
    } catch (err) {
      this.logger.error(
        `Error: Could not verify webhook: ${JSON.stringify(err)}`,
      );
      throw new BadRequestException('Error: Verification error');
    }
  }
}
