import { ClerkClient, Organization, WebhookEvent } from '@clerk/backend';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  RawBodyRequest,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CLERK_CLIENT, PERMIT_CLIENT } from '@services/clients';
import { Request } from 'express';
import { Permit, RoleAssignmentRead, RoleAssignmentRemove } from 'permitio';
import { Webhook } from 'svix';
import { SyncUserDto } from './dtos/sync-user.dto';
import { Role } from './role';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly clerkWebhook: Webhook;

  constructor(
    @Inject(CLERK_CLIENT) private readonly clerkClient: ClerkClient,
    @Inject(PERMIT_CLIENT) private readonly permitClient: Permit,
    private readonly configService: ConfigService,
  ) {
    this.clerkWebhook = new Webhook(
      this.configService.get<string>('CLERK_SIGNING_SECRET'),
    );
  }

  async getUserOrganization(userId: string): Promise<Organization | undefined> {
    try {
      const { data } =
        await this.clerkClient.users.getOrganizationMembershipList({
          userId,
        });
      return data[0]?.organization;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async sync({
    userId,
    organizationId,
    email,
    attributes,
    roles = [],
  }: SyncUserDto): Promise<void> {
    try {
      await this.permitClient.api.users.sync({
        key: userId,
        email: email,
        attributes: { ...attributes, organizationId },
        role_assignments: roles.map((role) => ({
          role,
          tenant: organizationId,
        })),
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async revokePermissions(
    userId: string,
    organizationId: string,
    roles: Role[] = [],
  ): Promise<void> {
    try {
      if (roles.length === 0) {
        const perPage = 50;
        let data: RoleAssignmentRead[] = [];
        let total_count = 1,
          page_count = 0,
          removed_roles_count = 0;
        while (total_count > removed_roles_count) {
          ({ data, total_count, page_count } =
            await this.permitClient.api.users.getAssignedRoles({
              user: userId,
              tenant: organizationId,
              includeTotalCount: true,
              perPage,
              page: page_count + 1,
            }));

          await this.permitClient.api.roleAssignments.bulkUnassign(
            data.map<RoleAssignmentRemove>(({ role, tenant_id }) => ({
              role,
              user: userId,
              tenant: tenant_id,
            })),
          );

          removed_roles_count += perPage;
        }
      } else {
        await this.permitClient.api.roleAssignments.bulkUnassign(
          roles.map<RoleAssignmentRemove>((role) => ({
            role,
            user: userId,
            tenant: organizationId,
          })),
        );
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  async processEvent(request: RawBodyRequest<Request>) {
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

        await this.sync({
          userId,
          organizationId,
          email,
        });
      }

      if (event.type === 'user.deleted') {
        const userId = event.data.id;
        const organization = await this.getUserOrganization(userId);
        await this.revokePermissions(userId, organization.id);
      }
    } catch (err) {
      this.logger.error(
        `Error: Could not verify webhook: ${JSON.stringify(err)}`,
      );
      throw new BadRequestException('Error: Verification error');
    }
  }
}
