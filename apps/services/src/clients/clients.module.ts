import { createClerkClient } from '@clerk/backend';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Permit } from 'permitio';
import Stripe from 'stripe';
import { CLERK_CLIENT, PERMIT_CLIENT, STRIPE_CLIENT } from './index';

@Global()
@Module({
  exports: [CLERK_CLIENT, PERMIT_CLIENT, STRIPE_CLIENT],
  providers: [
    {
      provide: CLERK_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createClerkClient({
          secretKey: configService.getOrThrow<string>('CLERK_SECRET_KEY'),
          publishableKey: configService.getOrThrow<string>(
            'CLERK_PUBLISHABLE_KEY',
          ),
        }),
    },
    {
      provide: PERMIT_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new Permit({
          pdp: configService.getOrThrow<string>('PERMITIO_PDP'),
          token: configService.getOrThrow<string>('PERMITIO_SECRET_KEY'),
          // log: {
          //   level: 'fatal',
          // },
        }),
    },
    {
      provide: STRIPE_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new Stripe(configService.getOrThrow<string>('STRIPE_SECRET_KEY')),
    },
  ],
})
export class ClientsModule {}
