import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/log/logging.interceptor';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
  }, {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    }],
})
export class AppModule { }
