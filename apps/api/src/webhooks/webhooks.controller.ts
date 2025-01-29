import {
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  OnModuleInit,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  PAYMENTS_SERVICE_NAME,
  PaymentsServiceClient,
  PaymentWebhookResponse,
  SERVICES_PACKAGE_NAME,
} from '@protos/payments.service';
import {
  USERS_SERVICE_NAME,
  UsersServiceClient,
  UserWebhookResponse,
} from '@protos/users.service';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Controller('webhooks')
export class WebhooksController implements OnModuleInit {
  private readonly logger = new Logger(WebhooksController.name);
  private paymentsServiceClient: PaymentsServiceClient;
  private usersServiceClient: UsersServiceClient;

  constructor(
    @Inject(SERVICES_PACKAGE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.paymentsServiceClient = this.client.getService<PaymentsServiceClient>(
      PAYMENTS_SERVICE_NAME,
    );
    this.usersServiceClient =
      this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  @Post('stripe')
  @HttpCode(HttpStatus.NO_CONTENT)
  stripe(
    @Req() req: RawBodyRequest<Request>,
  ): Observable<PaymentWebhookResponse> {
    return this.paymentsServiceClient.processEvent(req);
  }

  @Post('clerk')
  @HttpCode(HttpStatus.NO_CONTENT)
  clerk(@Req() req: RawBodyRequest<Request>): Observable<UserWebhookResponse> {
    return this.usersServiceClient.processEvent(req);
  }
}
