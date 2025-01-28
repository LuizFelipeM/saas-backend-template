import { RoutingKey } from '../routing-key';

export const authRtks = {
  verify: new RoutingKey('verify'),
  getUser: new RoutingKey('get', 'user'),
};
