import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Logger,
  OnModuleInit,
  Param,
  Post,
  Query,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import Stripe from 'stripe';
import {
  PAYMENTS_SERVICE_NAME,
  PaymentsServiceClient,
  SERVICES_PACKAGE_NAME,
} from '../../../../libs/protos/src/payments.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateCheckoutSessionDto } from './dtos/create-checkout-session.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController implements OnModuleInit {
  private readonly logger = new Logger(PaymentsController.name);
  private paymentsServiceClient: PaymentsServiceClient;

  constructor(
    @Inject(SERVICES_PACKAGE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.paymentsServiceClient = this.client.getService<PaymentsServiceClient>(
      PAYMENTS_SERVICE_NAME,
    );
  }

  @Post('checkout')
  @Redirect(undefined, HttpStatus.SEE_OTHER)
  async createCheckoutSession(
    @CurrentUserId() userId: string,
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
  ): Promise<{ url: string }> {
    const session = await this.paymentsServiceClient.createCheckoutSession(
      userId,
      createCheckoutSessionDto.plans,
    );

    return { url: session.url };
  }

  @Get('list-price')
  async listPrice(
    @Query('lookupKey') lookupKey: string[],
  ): Promise<Stripe.Response<Stripe.ApiList<Stripe.Price>>> {
    const session = await this.paymentsServiceClient.listPrice(lookupKey);
    return session;
  }

  @Post('customer')
  @Redirect(undefined, HttpStatus.SEE_OTHER)
  async createCustomerPortalSession(): Promise<{ url: string }> {
    // Pending session management
    const sessionId = '';
    const session =
      await this.paymentsServiceClient.createCustomerPortalSession(sessionId);
    return { url: session.url };
  }

  @Get(':status')
  checkoutSessionStatus(
    @Param() status: string,
    @Query('session_id') sessionId: string,
  ) {
    this.logger.log(`Checkout session ${status} with session ID ${sessionId}`);
  }
}
