import { Controller, Logger } from '@nestjs/common';
import {
  ExampleRequest,
  ExampleResponse,
  ExampleServiceController,
  ExampleServiceControllerMethods,
} from '@protos/proto-domain/example.service';
import { Observable } from 'rxjs';
import { ExampleService } from './example.service';

@Controller('example')
@ExampleServiceControllerMethods()
export class ExampleController implements ExampleServiceController {
  private readonly logger = new Logger(ExampleController.name);

  constructor(private readonly exampleService: ExampleService) {}

  getExample(
    request: ExampleRequest,
    ...rest: any
  ): Promise<ExampleResponse> | Observable<ExampleResponse> | ExampleResponse {
    return this.exampleService.getExample(request);
  }
}
