import { RoutingKey } from '../routing-key';

export const crmIntRtks = {
  rpc: new RoutingKey('crm-int', 'rpc'),
  sub: new RoutingKey('crm-int', 'sub'),
};
