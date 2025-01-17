import { Logger } from '@nestjs/common';

export class RoutingKey {
  private readonly logger = new Logger(RoutingKey.name);
  private readonly _value: string;

  constructor(...values: string[]) {
    this._value = values.join('.');
  }

  get value(): string {
    return this._value;
  }

  get all(): string {
    return `${this._value}.#`;
  }

  withEvent(value?: string): string {
    return `${this._value}${value ? `.${value}` : ''}`;
  }
}
