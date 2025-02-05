import { AuthenticationModule, GrpcModule } from '@common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ExamplesController } from './examples/examples.controller';
import { ResourcesController } from './resources/resources.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/api/.env',
      validationSchema: Joi.object({
        ST_SERVICES_URL: Joi.string().required(),
        ST_MAIN_URL: Joi.string().required(),
      }),
    }),

    GrpcModule,
    AuthenticationModule,
  ],
  controllers: [ResourcesController, ExamplesController],
  providers: [],
})
export class ApiModule {}
