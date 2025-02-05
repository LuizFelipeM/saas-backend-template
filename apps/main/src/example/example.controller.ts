import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  ExampleRequest,
  ExampleResponse,
  ExampleServiceController,
  ExampleServiceControllerMethods,
} from '../../../../libs/protos/src/proto-main/example.service';

@Controller('example')
@ExampleServiceControllerMethods()
export class ExampleController implements ExampleServiceController {
  greeting(
    request: ExampleRequest,
    ...rest: any
  ): Promise<ExampleResponse> | Observable<ExampleResponse> | ExampleResponse {
    return { message: `Hello ${request.name}! Welcome to the example service` };
  }
}
