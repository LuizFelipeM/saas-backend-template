import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('stripe')
  @HttpCode(HttpStatus.NO_CONTENT)
  stripe(@Req() req: RawBodyRequest<Request>): Promise<void> {
    return this.webhooksService.processEvent(req);
  }
}
