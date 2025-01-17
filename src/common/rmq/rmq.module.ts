import {
  RabbitMQChannels,
  RabbitMQConfig,
  RabbitMQModule,
} from '@golevelup/nestjs-rabbitmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Exchange } from '../constants/exchange';
import { RmqService } from './rmq.service';

interface RmqModuleOptions {
  exchanges: Exchange[];
  prefetchCount?: number;
  defaultRpcTimeout?: number;
  channels?: RabbitMQChannels;
}

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static forRoot({
    exchanges,
    prefetchCount = 20,
    defaultRpcTimeout = undefined,
    channels = {},
  }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      exports: [RabbitMQModule],
      imports: [
        RabbitMQModule.forRootAsync(RabbitMQModule, {
          inject: [ConfigService],
          useFactory: (
            configService: ConfigService,
          ): RabbitMQConfig | Promise<RabbitMQConfig> => ({
            enableControllerDiscovery: true,
            uri: configService.get<string>('RABBIT_MQ_URL'),
            exchanges: exchanges.map((e) => e.config),
            channels,
            prefetchCount,
            defaultRpcTimeout,
          }),
        }),
      ],
    };
  }
}
