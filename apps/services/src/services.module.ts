import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { ClientsModule } from './clients/clients.module';
import { FeedbacksModule } from './feedback/feedbacks.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PaymentsModule } from './payments/payments.module';
import { ResourcesModule } from './resources/resources.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/services/.env',
      validationSchema: Joi.object({
        DOMAIN: Joi.string().required(),
        DB_CONNECTION_STRING: Joi.string().required(),
        RABBIT_MQ_URL: Joi.string().required(),
        STRIPE_PUBLISHABLE_KEY: Joi.string().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
        STRIPE_ENDPOINT_SECRET: Joi.string().allow(''),
        PERMITIO_PDP: Joi.string().required(),
        PERMITIO_SECRET_KEY: Joi.string().required(),
      }),
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow<string>('DB_CONNECTION_STRING'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    OrganizationsModule,
    UsersModule,
    PaymentsModule,
    ResourcesModule,
    AuthenticationModule,
    AuthorizationModule,
    FeedbacksModule,
    ClientsModule,
    IntegrationsModule,
  ],
  exports: [TypeOrmModule],
})
export class ServicesModule {}
