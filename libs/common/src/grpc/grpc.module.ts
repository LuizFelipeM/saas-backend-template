import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICES_PACKAGE_NAME } from '@protos/saas-proto-services/authentication.service';

import { GRPC_SERVICES } from './grpc.services';
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
            url: configService.getOrThrow<string>('SERVICES_URL'),
            package: SERVICES_PACKAGE_NAME,
            protoPath: GrpcUtils.getProtoPaths(
              '../../../protos/saas-proto-services',
            ),
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcModule {}
