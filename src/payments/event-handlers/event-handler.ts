import Stripe from 'stripe';

export interface EventHandler {
  handle: (event: Stripe.Event) => Promise<void>;
}
