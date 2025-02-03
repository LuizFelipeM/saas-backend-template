import { AuthenticationModule, GrpcModule } from '@common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
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
    GrpcModule,
    AuthenticationModule,
  ],
  controllers: [ResourcesController],
  providers: [],
})
export class MainModule {}
