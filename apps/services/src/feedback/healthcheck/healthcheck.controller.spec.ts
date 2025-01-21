import { Test, TestingModule } from '@nestjs/testing';
import { HealthcheckController } from './healthcheck.controller';

describe('HealthcheckController', () => {
  let controller: HealthcheckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthcheckController],
    }).compile();

    controller = module.get<HealthcheckController>(HealthcheckController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have a health endpoint that returns void', () => {
    expect(controller.health).toBeDefined();
    expect(controller.health()).toEqual(undefined);
  });
});
