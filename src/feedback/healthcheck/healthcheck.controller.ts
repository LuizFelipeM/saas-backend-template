import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('healthcheck')
export class HealthcheckController {
  @Get()
  @HttpCode(HttpStatus.NO_CONTENT)
  health() {
    return;
  }
}
