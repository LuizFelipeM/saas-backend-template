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
import { PaymentsService } from '../payments.service';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly paymentService: PaymentsService) {}

  @Post('stripe')
  @HttpCode(HttpStatus.NO_CONTENT)
  async stripe(@Req() req: RawBodyRequest<Request>) {
    await this.paymentService.processEvent(req);
  }
}
