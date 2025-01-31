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

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async clerk(@Req() req: RawBodyRequest<Request>): Promise<void> {
    return await this.webhooksService.processEvent(req);
  }
}
