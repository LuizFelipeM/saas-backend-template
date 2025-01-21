import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

describe('PaymentsController', () => {
  let paymentController: PaymentsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [PaymentsService],
    }).compile();

    paymentController = app.get<PaymentsController>(PaymentsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(paymentController.getHello()).toBe('Hello World!');
    });
  });
});
