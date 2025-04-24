import { Injectable } from '@nestjs/common';
import {
  ExampleRequest,
  ExampleResponse,
} from '@protos/proto-domain/example.service';

@Injectable()
export class ExampleService {
  getExample(data: ExampleRequest): ExampleResponse {
    return {
      message: `Hello ${data.name}! Welcome to the example service`,
    };
  }
}
