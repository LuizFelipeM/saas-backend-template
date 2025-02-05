import { GrpcUtils } from '@common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { protobufPackage } from '@protos/saas-proto-services/resources.service';
import { ServicesModule } from './services.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ServicesModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:5000',
        package: protobufPackage,
        protoPath: GrpcUtils.getProtoPaths(
          '../../../protos/saas-proto-services',
        ),
      },
    },
  );
  await app.listen();
}
bootstrap();
