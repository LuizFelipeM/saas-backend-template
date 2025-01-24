import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICES_PACKAGE_NAME } from '@protos/resources.service';
import * as Joi from 'joi';
import { resolve } from 'node:path';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/api/.env',
      validationSchema: Joi.object({
        SERVICES_URL: Joi.string().required(),
      }),
    }),

    ClientsModule.registerAsync([
      {
        name: SERVICES_PACKAGE_NAME,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.getOrThrow<string>('SERVICES_URL'),
            package: SERVICES_PACKAGE_NAME,
            protoPath: [
              resolve(__dirname, '../../../protos/src/resources.service.proto'),
            ],
          },
        }),
      },
    ]),
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
