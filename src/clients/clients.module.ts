import { createClerkClient } from '@clerk/backend';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Permit } from 'permitio';
import { CLERK_CLIENT, PERMIT_CLIENT } from './index';

@Global()
@Module({
  exports: [CLERK_CLIENT, PERMIT_CLIENT],
  providers: [
    {
      provide: CLERK_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createClerkClient({
          secretKey: configService.get<string>('CLERK_SECRET_KEY'),
          publishableKey: configService.get<string>('CLERK_PUBLISHABLE_KEY'),
        }),
    },
    {
      provide: PERMIT_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new Permit({
          pdp: configService.get<string>('PERMITIO_PDP'),
          token: configService.get<string>('PERMITIO_SECRET_KEY'),
          log: {
            level: 'fatal',
          },
        }),
    },
  ],
})
export class ClientsModule {}
