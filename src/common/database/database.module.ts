import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

interface DatabaseModuleOptions {
  entities: EntityClassOrSchema[];
}

@Module({
  imports: [],
  exports: [],
  providers: [],
})
export class DatabaseModule {
  static forRoot({ entities }: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      exports: [TypeOrmModule],
      imports: [
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            url: configService.get<string>('DB_CONNECTION_STRING'),
            entities,
            synchronize: true,
          }),
        }),
      ],
    };
  }
}
