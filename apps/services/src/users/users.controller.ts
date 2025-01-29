import { Controller } from '@nestjs/common';
import {
  UsersServiceController,
  UsersServiceControllerMethods,
  UserWebhookRequest,
  UserWebhookResponse,
} from '@protos/users.service';
import { Observable } from 'rxjs';
import { UsersService } from './users.service';

@Controller()
@UsersServiceControllerMethods()
export class UsersController implements UsersServiceController {
  constructor(private readonly usersService: UsersService) {}

  processEvent(
    request: UserWebhookRequest,
    ...rest: any
  ):
    | Promise<UserWebhookResponse>
    | Observable<UserWebhookResponse>
    | UserWebhookResponse {
    return this.usersService.processEvent(request);
  }
}
