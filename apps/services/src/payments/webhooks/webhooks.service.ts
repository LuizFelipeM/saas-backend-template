import { Inject, Injectable, Logger, RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../../clients';
import { CustomerSubscriptionEventHandler } from '../event-handlers/customer-subscription/customer-subscription.event-handler';
import { EventHandler } from '../event-handlers/event-handler';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private readonly eventHandlers: EventHandler[] = [];

  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripeClient: Stripe,
    private readonly configService: ConfigService,
    private readonly customerSubscriptionEventHandler: CustomerSubscriptionEventHandler,
  ) {
    this.eventHandlers = [this.customerSubscriptionEventHandler];
  }

  async processEvent(request: RawBodyRequest<Request>): Promise<void> {
    let event = request.body as Stripe.Event;

    const endpointSecret = this.configService.getOrThrow<string>(
      'STRIPE_ENDPOINT_SECRET',
    );

    if (!endpointSecret) {
      try {
        const signature = request.header('stripe-signature');
        event = this.stripeClient.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret,
        );
      } catch (err) {
        this.logger.error(
          '⚠️ Webhook signature verification failed.',
          err.message,
        );
        throw new Error('⚠️ Webhook signature verification failed.');
      }
    }

    await Promise.all(
      this.eventHandlers.map((handler) => handler.handle(event)),
    );
  }
}
