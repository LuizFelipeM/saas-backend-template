import { RmqService, RoutingKeys } from '@common';
import {
  CustomerSubscriptionEventTypes,
  SubscriptionCreatedDto,
  SubscriptionDeletedDto,
  SubscriptionUpdatedDto,
} from '@contracts/payment';
import { EntitlementDto } from '@contracts/payment/customer-subscription/entitlement.dto';
import { SubscriptionStatus } from '@contracts/payment/customer-subscription/subscription-status';
import { Injectable, Logger, RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthenticationService } from 'src/authentication/authentication.service';
import Stripe from 'stripe';

type LineItem = Stripe.Checkout.SessionCreateParams.LineItem;

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly authenticationService: AuthenticationService,
    private readonly rmqService: RmqService,
  ) {
    this.stripe = new Stripe(configService.get<string>('STRIPE_SECRET_KEY'));
  }

  async listPrice(
    lookupKey: string[],
  ): Promise<Stripe.Response<Stripe.ApiList<Stripe.Price>>> {
    const prices = await this.stripe.prices.list({
      lookup_keys: lookupKey,
      expand: ['data.product'],
    });
    return prices;
  }

  async createCheckoutSession(
    userId: string,
    lookupKeys: Record<string, { quantity: { min: number; max?: number } }>,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const prices = await this.stripe.prices.list({
      lookup_keys: Object.keys(lookupKeys),
      expand: [],
    });

    const user = await this.authenticationService.getUserById(userId);
    const domain = this.configService.get<string>('DOMAIN');
    const userEmail = user.emailAddresses[0].emailAddress;
    const session = await this.stripe.checkout.sessions.create({
      line_items: prices.data.map<LineItem>(({ id, lookup_key }) => {
        let adjustable_quantity: LineItem['adjustable_quantity'] = undefined;

        if (!!lookupKeys[lookup_key].quantity.max)
          adjustable_quantity = {
            enabled: true,
            minimum: lookupKeys[lookup_key].quantity.min,
            maximum: lookupKeys[lookup_key].quantity.max,
          };

        return {
          price: id,
          quantity: lookupKeys[lookup_key].quantity.min,
          adjustable_quantity,
        };
      }),
      mode: 'subscription',
      subscription_data: {
        metadata: {
          userId,
          userEmail,
        },
      },
      client_reference_id: userId,
      customer_email: userEmail,
      success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/canceled`,
    });

    return session;
  }

  async createCustomerPortalSession(
    sessionId: string,
  ): Promise<Stripe.Response<Stripe.BillingPortal.Session>> {
    // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
    // Typically this is stored alongside the authenticated user in your database.
    const checkoutSession =
      await this.stripe.checkout.sessions.retrieve(sessionId);

    let customer: string;
    if (typeof checkoutSession.customer === 'string')
      customer = checkoutSession.customer;
    else {
      if (checkoutSession.customer.deleted)
        throw new Error('Unable to create a portal session for a deleted user');
      customer = checkoutSession.customer.id;
    }

    // This is the url to which the customer will be redirected when they are done
    // managing their billing with the portal.
    const session = await this.stripe.billingPortal.sessions.create({
      customer,
      return_url: this.configService.get<string>('DOMAIN'),
    });

    return session;
  }

  async processEvent(
    request: RawBodyRequest<Request>,
    // stripeSignature: string,
    // body: Stripe.Event | string | Buffer,
  ): Promise<void> {
    let event: Stripe.Event = request.body as Stripe.Event;

    // Replace this endpoint secret with your endpoint's unique secret
    // If you are testing with the CLI, find the secret by running 'stripe listen'
    // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
    // at https://dashboard.stripe.com/webhooks
    const endpointSecret = this.configService.get<string>(
      'STRIPE_ENDPOINT_SECRET',
    );

    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (!endpointSecret) {
      try {
        const signature = request.header('stripe-signature');
        event = this.stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret,
        );
      } catch (err) {
        this.logger.error(
          '⚠️  Webhook signature verification failed.',
          err.message,
        );
        throw new Error('⚠️  Webhook signature verification failed.');
      }
    }

    switch (event.type) {
      case 'checkout.session.completed':
        event.data.object.client_reference_id;
        break;
      case 'customer.subscription.trial_will_end':
        this.handleSubscriptionTrialEnding(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object);
        break;
      default:
        this.logger.error(`Unhandled event type ${event.type}.`);
        break;
    }
  }

  private handleSubscriptionTrialEnding(subscription: Stripe.Subscription) {
    throw new Error('Function not implemented.');
  }

  private async handleSubscriptionDeleted(
    subscription: Stripe.Subscription,
  ): Promise<boolean> {
    const { userId, userEmail } = subscription.metadata;

    const payload: SubscriptionDeletedDto = {
      customer: {
        id: subscription.customer.toString(),
        email: userEmail,
      },
      user: {
        id: userId,
        email: userEmail,
      },
      status: SubscriptionStatus[subscription.status],
    };

    return await this.rmqService.publish(
      RoutingKeys.payment.customerSubscription,
      payload,
      CustomerSubscriptionEventTypes.deleted,
    );
  }

  private async getEntitlements(
    subscription: Stripe.Subscription,
  ): Promise<EntitlementDto[]> {
    return (
      await Promise.all(
        subscription.items.data.map(async ({ price, quantity }) =>
          (
            await this.stripe.products.listFeatures(price.product.toString())
          ).data.map<EntitlementDto>(({ entitlement_feature }) => ({
            name: entitlement_feature.lookup_key,
            attributes: { quantity },
          })),
        ),
      )
    ).flat();
  }

  private async handleSubscriptionCreated(
    subscription: Stripe.Subscription,
  ): Promise<boolean> {
    const { userId, userEmail } = subscription.metadata;

    const payload: SubscriptionCreatedDto = {
      customer: {
        id: subscription.customer.toString(),
        email: userEmail,
      },
      user: {
        id: userId,
        email: userEmail,
      },
      entitlements: await this.getEntitlements(subscription),
      expiresAt: new Date(subscription.current_period_end),
      status: SubscriptionStatus[subscription.status],
    };

    return await this.rmqService.publish(
      RoutingKeys.payment.customerSubscription,
      payload,
      CustomerSubscriptionEventTypes.created,
    );
  }

  private async handleSubscriptionUpdated(
    subscription: Stripe.Subscription,
  ): Promise<boolean> {
    const { userId, userEmail } = subscription.metadata;

    const payload: SubscriptionUpdatedDto = {
      customer: {
        id: subscription.customer.toString(),
        email: userEmail,
      },
      user: {
        id: userId,
        email: userEmail,
      },
      expiresAt: new Date(subscription.current_period_end),
      status: SubscriptionStatus[subscription.status],
      entitlements: await this.getEntitlements(subscription),
    };

    return await this.rmqService.publish(
      RoutingKeys.payment.customerSubscription,
      payload,
      CustomerSubscriptionEventTypes.updated,
    );
  }
}
