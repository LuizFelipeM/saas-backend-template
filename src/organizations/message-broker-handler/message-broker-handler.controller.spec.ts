import { Test, TestingModule } from '@nestjs/testing';
import { MessageBrokerHandlerController } from './message-broker-handler.controller';

describe('MessageBrokerHandlerController', () => {
  let controller: MessageBrokerHandlerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageBrokerHandlerController],
    }).compile();

    controller = module.get<MessageBrokerHandlerController>(MessageBrokerHandlerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
