import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MAIN_PACKAGE_NAME } from '@protos/proto-main/example.service';
import { SERVICES_PACKAGE_NAME } from '@protos/saas-proto-services/authentication.service';
import { GRPC_MAIN, GRPC_SERVICES } from './grpc.services';
import { GrpcUtils } from './grpc.utils';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: GRPC_SERVICES,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.getOrThrow<string>('ST_SERVICES_URL'),
            package: SERVICES_PACKAGE_NAME,
            protoPath: GrpcUtils.getProtoPaths(
              '../../../protos/saas-proto-services',
            ),
          },
        }),
      },
      {
        name: GRPC_MAIN,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.getOrThrow<string>('ST_MAIN_URL'),
            package: MAIN_PACKAGE_NAME,
            protoPath: GrpcUtils.getProtoPaths('../../../protos/proto-main'),
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcModule {}
