import { GrpcUtils } from '@common/grpc';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { protobufPackage } from '@protos/proto-domain/example.service';
import { DomainModule } from './domain.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DomainModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:5000',
        package: protobufPackage,
        protoPath: GrpcUtils.getProtoPaths('../../../protos/proto-domain'),
      },
    },
  );

  await app.listen();
}

bootstrap();
