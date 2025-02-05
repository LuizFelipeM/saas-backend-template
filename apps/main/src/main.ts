import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GrpcUtils } from '../../../libs/common/src';
import { protobufPackage } from '../../../libs/protos/src/proto-main/example.service';
import { MainModule } from './main.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MainModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:5000',
        package: protobufPackage,
        protoPath: GrpcUtils.getProtoPaths('../../../protos/proto-main'),
      },
    },
  );
  await app.listen();
}
bootstrap();
