import { Controller, Get, HttpException, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SentryInterceptor } from './interceptors/sentry/sentry.interceptor';


@ApiTags('App')
@UseInterceptors(new SentryInterceptor())
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOkResponse({ description: 'Return Hello World' })
  getHello(): string {
    try {
      return this.appService.getHello();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
