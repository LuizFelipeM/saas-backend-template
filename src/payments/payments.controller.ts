import { CurrentUserId } from '@common/decorators';
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
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import Stripe from 'stripe';
import { CreateCheckoutSessionDto } from './dtos/create-checkout-session.dto';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentService: PaymentsService) {}

  @Post('checkout')
  // @UseGuards(JwtAuthGuard)
  @Redirect(undefined, HttpStatus.SEE_OTHER)
  async createCheckoutSession(
    @CurrentUserId() userId: string,
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
  ): Promise<{ url: string }> {
    const session = await this.paymentService.createCheckoutSession(
      userId,
      // createCheckoutSessionDto.lookupKey
      {
        premium_platform_access: { quantity: { min: 1 } },
        premium_platform_users_quantity_access: {
          quantity: { min: 10, max: 100 },
        },
        platform_integration: { quantity: { min: 3, max: 5 } },
      },
    );

    return { url: session.url };
  }

  @Get('list-price')
  @UseGuards(JwtAuthGuard)
  async listPrice(
    @Query('lookupKey') lookupKey: string[],
  ): Promise<Stripe.Response<Stripe.ApiList<Stripe.Price>>> {
    const session = await this.paymentService.listPrice(lookupKey);
    return session;
  }

  @Post('customer')
  @UseGuards(JwtAuthGuard)
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
