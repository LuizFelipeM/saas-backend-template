import { STRIPE_CLIENT } from '@clients';
import { PaginationParams } from '@contracts/pagination-params';
import { EntitlementDto } from '@contracts/payment/customer-subscription/entitlement.dto';
import { SubscriptionStatus } from '@contracts/payment/customer-subscription/subscription-status';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateOrganizationDto } from 'src/organizations/dtos/create-organization.dto';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { Role } from 'src/users/role';
import { UsersService } from 'src/users/users.service';
import Stripe from 'stripe';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { EventHandler } from '../event-handler';

@Injectable()
export class CustomerSubscriptionEventHandler implements EventHandler {
  private readonly logger = new Logger(CustomerSubscriptionEventHandler.name);

  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripeClient: Stripe,
    private readonly organizationsService: OrganizationsService,
    private readonly usersService: UsersService,
  ) {}

  async handle(event: Stripe.Event) {
    switch (event.type) {
      case 'customer.subscription.trial_will_end':
        this.handleSubscriptionTrialEnding(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;

      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object);
        break;
    }
  }

  private handleSubscriptionTrialEnding(subscription: Stripe.Subscription) {
    throw new Error('Function not implemented.');
  }

  private async getEntitlements(
    subscription: Stripe.Subscription,
  ): Promise<EntitlementDto[]> {
    return (
      await Promise.all(
        subscription.items.data.map(async ({ price, quantity }) =>
          (
            await this.stripeClient.products.listFeatures(
              price.product.toString(),
            )
          ).data.map<EntitlementDto>(({ entitlement_feature }) => ({
            name: entitlement_feature.lookup_key,
            attributes: { quantity },
          })),
        ),
      )
    ).flat();
  }

  private async handleSubscriptionUpdated(
    subscription: Stripe.Subscription,
  ): Promise<boolean> {
    const { userId, userEmail } = subscription.metadata;

    if (subscription.status !== SubscriptionStatus.active) return;

    const entitlements = await this.getEntitlements(subscription);
    const userLicensesEntitlement = entitlements.find(
      (e) => e.name === 'userLicenses',
    );
    if (!userLicensesEntitlement)
      throw new Error('No user licenses entitlement found');

    const createOrganization = new CreateOrganizationDto();

    createOrganization.userId = userId;
    createOrganization.maxUsers = Number(
      userLicensesEntitlement.attributes.quantity,
    );
    createOrganization.name = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      length: 3,
      separator: ' ',
      style: 'capital',
    });
    createOrganization.attributes = entitlements.reduce(
      (prev, curr) => ({ ...prev, [curr.name]: curr.attributes }),
      {},
    );

    const organization =
      await this.organizationsService.create(createOrganization);
    await this.usersService.sync({
      userId: userId,
      organizationId: organization.id,
      email: userEmail,
      roles: [Role.owner],
    });
  }

  private async handleSubscriptionDeleted(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    const { userId } = subscription.metadata;

    const organization =
      await this.organizationsService.getUserOrganization(userId);

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
