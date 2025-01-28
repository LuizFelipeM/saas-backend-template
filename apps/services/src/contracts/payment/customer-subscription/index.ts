import { Event } from '../../message-broker/event';
import { SubscriptionCreatedDto } from './subscription-created.dto';
import { SubscriptionDeletedDto } from './subscription-deleted.dto';
import { SubscriptionUpdatedDto } from './subscription-updated.dto';

export * from './subscription-created.dto';
export * from './subscription-deleted.dto';
export * from './subscription-updated.dto';

export enum CustomerSubscriptionEventTypes {
  created = 'created',
  deleted = 'deleted',
  updated = 'updated',
}

export type CreatedCustomerSubscriptionEvent = Event<
  SubscriptionCreatedDto,
  CustomerSubscriptionEventTypes.created
>;
export type DeletedCustomerSubscriptionEvent = Event<
  SubscriptionDeletedDto,
  CustomerSubscriptionEventTypes.deleted
>;
export type UpdatedCustomerSubscriptionEvent = Event<
  SubscriptionUpdatedDto,
  CustomerSubscriptionEventTypes.updated
>;

export type CustomerSubscriptionEvent =
  | CreatedCustomerSubscriptionEvent
  | DeletedCustomerSubscriptionEvent
  | UpdatedCustomerSubscriptionEvent;
