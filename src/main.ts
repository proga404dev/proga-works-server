import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as os from 'os';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({});

  const config = new DocumentBuilder()
    .setTitle('Proga Works API')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config, {});
  SwaggerModule.setup('api/doc', app, document);

  await app.listen(port);
  Logger.log(`Server running on ${os.hostname}:${port}`, 'Bootstrap');
}
bootstrap();

