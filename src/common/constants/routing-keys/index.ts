import { authRtks } from './auth.routingkey';
import { authorizationRtks } from './authorization.routingkey';
import { crmIntRtks } from './crm-int.routingkey';
import { emailIntRtks } from './email-int.routingkey';
import { paymentRtks } from './payment.routingkey';
import { permissionRtks } from './permission.routingkey';
import { resourceRtks } from './resource.routingkey';

export const RoutingKeys = {
  auth: authRtks,
  authorization: authorizationRtks,
  permission: permissionRtks,
  payment: paymentRtks,
  crmInt: crmIntRtks,
  emailInt: emailIntRtks,
  resource: resourceRtks,
};
