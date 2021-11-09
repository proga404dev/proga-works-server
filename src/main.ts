import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as os from 'os';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({});

  await app.listen(port);
  Logger.log(`Server running on ${os.hostname}:${port}`, 'Bootstrap');
}
bootstrap();

