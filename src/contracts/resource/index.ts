import { Event } from '../message-broker/event';
import { ResourceCreatedDto } from './resource-created.dto';
import { ResourceDeletedDto } from './resource-deleted.dto';
import { ResourceUpdatedDto } from './resource-updated.dto';

export enum ResourceEventTypes {
  created = 'created',
  deleted = 'deleted',
  updated = 'updated',
}

export type CreatedResourceEvent = Event<
  ResourceCreatedDto,
  ResourceEventTypes.created
>;
export type DeletedResourceEvent = Event<
  ResourceDeletedDto,
  ResourceEventTypes.deleted
>;
export type UpdatedResourceEvent = Event<
  ResourceUpdatedDto,
  ResourceEventTypes.updated
>;

export type ResourceEvent =
  | CreatedResourceEvent
  | DeletedResourceEvent
  | UpdatedResourceEvent;
