import { RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';

export class Exchange {
  private readonly _config: RabbitMQExchangeConfig;
  constructor(config: RabbitMQExchangeConfig) {
    this._config = config;
  }

  get name(): string {
    return this._config.name;
  }

  get config(): RabbitMQExchangeConfig {
    return this._config;
  }
}
