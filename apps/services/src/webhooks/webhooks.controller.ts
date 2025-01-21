import {
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from '../payments/payments.service';
import { UsersService } from '../users/users.service';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('stripe')
  @HttpCode(HttpStatus.NO_CONTENT)
  async stripe(@Req() req: RawBodyRequest<Request>) {
    await this.paymentsService.processEvent(req);
  }

  @Post('clerk')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clerk(@Req() req: RawBodyRequest<Request>) {
    await this.usersService.processEvent(req);
  }
}
