import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SERVICES_PACKAGE_NAME } from '@protos/resources.service';
import * as Joi from 'joi';
import { resolve } from 'node:path';
import { ResourcesController } from './resources/resources.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/main/.env',
      validationSchema: Joi.object({
        DB_CONNECTION_STRING: Joi.string().required(),
        SERVICES_URL: Joi.string().required(),
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
  controllers: [ResourcesController],
  providers: [],
})
export class MainModule {}
