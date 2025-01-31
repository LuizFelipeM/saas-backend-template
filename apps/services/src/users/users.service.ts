import { ClerkClient, Organization } from '@clerk/backend';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Permit, RoleAssignmentRead, RoleAssignmentRemove } from 'permitio';
import { CLERK_CLIENT, PERMIT_CLIENT } from '../clients';
import { SyncUserDto } from './dtos/sync-user.dto';
import { Role } from './role';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject(CLERK_CLIENT) private readonly clerkClient: ClerkClient,
    @Inject(PERMIT_CLIENT) private readonly permitClient: Permit,
  ) {}

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
}
