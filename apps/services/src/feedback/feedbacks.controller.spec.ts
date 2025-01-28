import { Test, TestingModule } from '@nestjs/testing';
import { FeedbacksController } from './feedbacks.controller';
import { FeedbacksService } from './feedbacks.service';

describe('FeedbacksController', () => {
  let feedbackController: FeedbacksController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FeedbacksController],
      providers: [FeedbacksService],
    }).compile();

    feedbackController = app.get<FeedbacksController>(FeedbacksController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(feedbackController.getHello()).toBe('Hello World!');
    });
  });
});
