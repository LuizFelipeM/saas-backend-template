import { Exchanges, RoutingKeys } from '@common';
import { PaginationParams } from '@contracts/pagination-params';
import {
  CustomerSubscriptionEvent,
  CustomerSubscriptionEventTypes,
  SubscriptionDeletedDto,
  SubscriptionUpdatedDto,
} from '@contracts/payment';
import { SubscriptionStatus } from '@contracts/payment/customer-subscription/subscription-status';
import {
  Nack,
  RabbitPayload,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Controller, Logger } from '@nestjs/common';
import { Role } from 'src/users/role';
import { UsersService } from 'src/users/users.service';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { OrganizationsService } from '../organizations.service';

@Controller()
export class MessageBrokerHandlerController {
  private readonly logger = new Logger(MessageBrokerHandlerController.name);

  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly usersService: UsersService,
  ) {}

  @RabbitSubscribe({
    exchange: Exchanges.events.name,
    routingKey: RoutingKeys.payment.customerSubscription.all,
    queue: 'organizations.customer.subscription.events',
  })
  async customerSubscriptionHandler(
    @RabbitPayload() { type, data }: CustomerSubscriptionEvent,
  ): Promise<void | Nack> {
    try {
      switch (type) {
        case CustomerSubscriptionEventTypes.created:
          return;
        case CustomerSubscriptionEventTypes.updated:
          return await this.handleUpdatedSubscription(data);
        case CustomerSubscriptionEventTypes.deleted:
          return await this.handleDeletedSubscription(data);
      }
    } catch (err) {
      this.logger.error(err);
      return new Nack();
    }
  }

  async handleUpdatedSubscription(
    subscription: SubscriptionUpdatedDto,
  ): Promise<void> {
    if (subscription.status !== SubscriptionStatus.active) return;

    const userLicensesEntitlement = subscription.entitlements.find(
      (e) => e.name === 'userLicenses',
    );
    if (!userLicensesEntitlement)
      throw new Error('No user licenses entitlement found');

    const createOrganization = new CreateOrganizationDto();

    createOrganization.userId = subscription.user.id;
    createOrganization.maxUsers = Number(
      userLicensesEntitlement.attributes.quantity,
    );
    createOrganization.name = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      length: 3,
      separator: ' ',
      style: 'capital',
    });
    createOrganization.attributes = subscription.entitlements.reduce(
      (prev, curr) => ({ ...prev, [curr.name]: curr.attributes }),
      {},
    );

    const organization =
      await this.organizationsService.create(createOrganization);
    await this.usersService.sync({
      userId: subscription.user.id,
      organizationId: organization.id,
      email: subscription.user.email,
      roles: [Role.owner],
    });
  }

  async handleDeletedSubscription(
    subscription: SubscriptionDeletedDto,
  ): Promise<void> {
    const organization = await this.organizationsService.getUserOrganization(
      subscription.user.id,
    );

    const limit = 25;
    let hasMore = false;
    let page = 1;
    let data: string[] = [];
    do {
      ({ data, hasMore } =
        await this.organizationsService.getOrganizationUserIds(
          organization.id,
          new PaginationParams({ limit, page }),
        ));

      await Promise.all(
        data.map((userId) => {
          this.usersService.revokePermissions(userId, organization.id);
        }),
      );

      if (hasMore) page++;
    } while (hasMore);

    this.logger.log(`Deleted organization ${organization.id}`);
  }
}
