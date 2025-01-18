import { Test, TestingModule } from '@nestjs/testing';
import { CustomerSubscriptionEventHandler } from './customer-subscription.event-handler';

describe('CustomerSubscriptionService', () => {
  let service: CustomerSubscriptionEventHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerSubscriptionEventHandler],
    }).compile();

    service = module.get<CustomerSubscriptionEventHandler>(
      CustomerSubscriptionEventHandler,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
