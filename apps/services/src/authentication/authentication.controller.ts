import { Controller, Logger, UnauthorizedException } from '@nestjs/common';
import {
  AuthenticationServiceController,
  AuthenticationServiceControllerMethods,
  VerifyAuthenticationRequest,
  VerifyAuthenticationResponse,
} from '@protos/saas-proto-services/authentication.service';
import { ProtoMessageUtils } from '@protos/utils/proto-message.utils';
import { AuthenticationService } from './authentication.service';

@Controller()
@AuthenticationServiceControllerMethods()
export class AuthenticationController
  implements AuthenticationServiceController
{
  private readonly logger = new Logger(AuthenticationController.name);

  constructor(private readonly authenticationService: AuthenticationService) {}

  async verify(
    request: VerifyAuthenticationRequest,
    ...rest: any
  ): Promise<VerifyAuthenticationResponse> {
    try {
      return {
        authorized: true,
        token: ProtoMessageUtils.toMap(
          await this.authenticationService.verify(request.token),
        ),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return {
          authorized: false,
          token: {},
        };
      }

      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }
}
