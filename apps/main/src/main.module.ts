import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { ExampleModule } from './example/example.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/main/.env',
      validationSchema: Joi.object({
        DB_CONNECTION_STRING: Joi.string().required(),
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
    ExampleModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
