import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateResourceRequest } from '@protos/resources.service';
import { ApiService } from './api.service';

@Controller()
export class ApiController {
  private readonly logger = new Logger(ApiController.name);

  constructor(private readonly apiService: ApiService) {}

  @Post()
  create(@Body() payload: CreateResourceRequest) {
    this.logger.log(payload);
    const obs = this.apiService.create(payload);
    return obs;
  }
}
