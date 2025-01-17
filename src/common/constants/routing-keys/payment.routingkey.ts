import { RoutingKey } from '../routing-key';

export const paymentRtks = {
  customerSubscription: new RoutingKey('customer', 'subscription'),
};
