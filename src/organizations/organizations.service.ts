import {
  ClerkClient,
  createClerkClient,
  Organization,
  OrganizationInvitation,
} from '@clerk/backend';
import { OrganizationInvitationStatus } from '@clerk/types';
import { PaginatedResource } from '@contracts/paginated-resource';
import { PaginationParams } from '@contracts/pagination-params';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Permit, PermitApiError } from 'permitio';
import { Role } from '../users/role';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);
  private readonly clerk: ClerkClient;
  private readonly permit: Permit;

  constructor(private readonly configService: ConfigService) {
    this.clerk = createClerkClient({
      secretKey: this.configService.get<string>('CLERK_SECRET_KEY'),
      publishableKey: this.configService.get<string>('CLERK_PUBLISHABLE_KEY'),
    });

    this.permit = new Permit({
      pdp: this.configService.get<string>('PERMITIO_PDP'),
      token: this.configService.get<string>('PERMITIO_SECRET_KEY'),
      throwOnError: false,
      multiTenancy: {
        useDefaultTenantIfEmpty: true,
      },
    });
  }

  async create({
    userId,
    name,
    maxUsers,
    slug,
    attributes,
  }: CreateOrganizationDto): Promise<Organization> {
    try {
      let organization = await this.getUserOrganization(userId);
      if (!organization) {
        organization = await this.clerk.organizations.createOrganization({
          name,
          createdBy: userId,
          maxAllowedMemberships: maxUsers,
          slug,
          privateMetadata: attributes,
        });
      }

      await this.syncTenant(organization.id, name, {
        ...attributes,
        maxUserLicensesCount: maxUsers,
      });

      return organization;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async syncTenant(
    organizationId: string,
    name: string,
    attributes?: Record<string, unknown>,
  ): Promise<void> {
    try {
      const tenant = await this.permit.api.tenants.get(organizationId);
      if (tenant) {
        await this.permit.api.tenants.update(organizationId, {
          name,
          attributes,
        });
      }
    } catch (error) {
      if (error instanceof PermitApiError)
        await this.permit.api.tenants.create({
          key: organizationId,
          name,
          attributes,
        });
      else this.logger.error(error);
    }
  }

  async update({
    id,
    name,
    maxUsers,
    slug,
    attributes,
  }: UpdateOrganizationDto): Promise<Organization> {
    try {
      const organization = await this.clerk.organizations.updateOrganization(
        id,
        {
          name,
          maxAllowedMemberships: maxUsers,
          slug,
        },
      );

      await this.permit.api.tenants.update(id, {
        name,
        attributes: { ...attributes, maxUserLicensesCount: maxUsers },
      });

      return organization;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async get(organizationId: string): Promise<Organization> {
    try {
      return await this.clerk.organizations.getOrganization({
        organizationId,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getUserOrganization(userId: string): Promise<Organization | undefined> {
    try {
      const { data } = await this.clerk.users.getOrganizationMembershipList({
        userId,
      });
      return data[0]?.organization;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getOrganizationUserIds(
    organizationId: string,
    pagination?: PaginationParams,
  ): Promise<PaginatedResource<string>> {
    try {
      const { data, totalCount } =
        await this.clerk.organizations.getOrganizationMembershipList({
          organizationId,
          limit: pagination.limit,
          offset: pagination.offset,
        });
      return new PaginatedResource(
        data.map((d) => d.publicUserData.userId),
        totalCount,
        pagination.offset,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getInvitationList(
    organizationId: string,
    status?: OrganizationInvitationStatus[],
    pagination?: PaginationParams,
  ): Promise<PaginatedResource<OrganizationInvitation>> {
    try {
      const { data, totalCount } =
        await this.clerk.organizations.getOrganizationInvitationList({
          organizationId,
          status,
          limit: pagination.limit,
          offset: pagination.offset,
        });
      return new PaginatedResource(data, totalCount, pagination.offset);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async inviteUser(
    inviterUserId: string,
    email: string,
    organizationId: string,
    role = Role.member,
  ): Promise<OrganizationInvitation> {
    try {
      return await this.clerk.organizations.createOrganizationInvitation({
        emailAddress: email,
        inviterUserId,
        organizationId,
        role,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async revokeInvitation(
    invitationId: string,
    organizationId: string,
    userId: string,
  ): Promise<OrganizationInvitation> {
    try {
      return await this.clerk.organizations.revokeOrganizationInvitation({
        invitationId,
        organizationId,
        requestingUserId: userId,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
