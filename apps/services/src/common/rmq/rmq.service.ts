import { AmqpConnection, RequestOptions } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import {
  Command,
  CommandResponse,
  Event,
} from '@services/contracts/message-broker';
import { Options } from 'amqplib';
import { Exchange } from '../constants/exchange';
import { Exchanges } from '../constants/exchanges';
import { RoutingKey } from '../constants/routing-key';

interface CommandRequestOptions<T = undefined, P = unknown>
  extends Omit<RequestOptions, 'exchange' | 'routingKey'> {
  routingKey: RoutingKey;
  payload: P;
  type?: T;
  exchange?: Exchange;
}

interface EventPublishOptions<T = string, P = unknown> extends Options.Publish {
  routingKey: RoutingKey;
  payload: P;
  eventType: T;
  exchange?: Exchange;
}

@Injectable()
export class RmqService {
  private readonly logger = new Logger(RmqService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  private isRoutingKey(val: unknown): val is RoutingKey {
    return val instanceof RoutingKey;
  }

  request<P, R, T = undefined>(
    options: CommandRequestOptions<T, P>,
  ): Promise<CommandResponse<R>>;
  request<P, R, T = undefined>(
    routingKey: RoutingKey,
    payload: P,
    type?: T,
    exchange?: Exchange,
  ): Promise<CommandResponse<R>>;
  request<P, R, T = undefined>(
    opts: CommandRequestOptions<T, P> | RoutingKey,
    pld?: P,
    typ?: T,
    exc?: Exchange,
  ): Promise<CommandResponse<R>> {
    const { exchange, routingKey, payload, type, ...options } =
      this.isRoutingKey(opts)
        ? { exchange: exc, routingKey: opts, payload: pld, type: typ }
        : opts;

    return this.amqpConnection.request<CommandResponse<R>>({
      exchange: exchange?.name ?? Exchanges.commands.name,
      routingKey: routingKey.withEvent(type ? String(type) : undefined),
      payload: Command.build(payload, type),
      timeout: 5000,
      ...options,
    });
  }

  publish<T = string, P = unknown>(
    options: EventPublishOptions<T, P>,
  ): Promise<boolean>;
  publish<T = string, P = unknown>(
    routingKey: RoutingKey,
    payload: P,
    eventType: T,
    exchange?: Exchange,
  ): Promise<boolean>;
  publish<T = string, P = unknown>(
    opts: EventPublishOptions<T, P> | RoutingKey,
    pld?: P,
    etyp?: T,
    exc?: Exchange,
  ): Promise<boolean> {
    const { exchange, routingKey, payload, eventType, ...options } =
      this.isRoutingKey(opts)
        ? { exchange: exc, routingKey: opts, payload: pld, eventType: etyp }
        : opts;

    return this.amqpConnection.publish(
      exchange?.name ?? Exchanges.events.name,
      routingKey.withEvent(eventType ? String(eventType) : undefined),
      Event.build(payload, eventType),
      options,
    );
  }
}
