import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { protobufPackage } from '@protos/resources.service';
import { resolve } from 'node:path';
import { ServicesModule } from './services.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ServicesModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:5000',
        package: protobufPackage,
        protoPath: [
          resolve(__dirname, '../../../protos/src/resources.service.proto'),
        ],
      },
    },
  );
  await app.listen();
}
bootstrap();
