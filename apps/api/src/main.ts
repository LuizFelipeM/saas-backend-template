import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ApiModule } from './api.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.use(cookieParser());
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
