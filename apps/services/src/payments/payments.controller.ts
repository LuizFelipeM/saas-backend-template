import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { CurrentUserId } from '@services/common/decorators';
import Stripe from 'stripe';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { CreateCheckoutSessionDto } from './dtos/create-checkout-session.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentService: PaymentsService) {}

  @Post('checkout')
  @Redirect(undefined, HttpStatus.SEE_OTHER)
  async createCheckoutSession(
    @CurrentUserId() userId: string,
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
  ): Promise<{ url: string }> {
    const session = await this.paymentService.createCheckoutSession(
      userId,
      createCheckoutSessionDto.plans,
    );

    return { url: session.url };
  }

  @Get('list-price')
  async listPrice(
    @Query('lookupKey') lookupKey: string[],
  ): Promise<Stripe.Response<Stripe.ApiList<Stripe.Price>>> {
    const session = await this.paymentService.listPrice(lookupKey);
    return session;
  }

  @Post('customer')
  @Redirect(undefined, HttpStatus.SEE_OTHER)
  async createCustomerPortalSession(): Promise<{ url: string }> {
    // Pending session management
    const sessionId = '';
    const session =
      await this.paymentService.createCustomerPortalSession(sessionId);
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
