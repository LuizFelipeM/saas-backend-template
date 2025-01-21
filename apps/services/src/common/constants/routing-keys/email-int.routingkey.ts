import { RoutingKey } from '../routing-key';

export const emailIntRtks = {
  send: new RoutingKey('email', 'send'),
  save: new RoutingKey('email', 'save'),
};
