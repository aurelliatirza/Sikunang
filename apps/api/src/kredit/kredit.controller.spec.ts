import { Test, TestingModule } from '@nestjs/testing';
import { KreditController } from './kredit.controller';
import { KreditService } from './kredit.service';

describe('KreditController', () => {
  let controller: KreditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KreditController],
      providers: [KreditService],
    }).compile();

    controller = module.get<KreditController>(KreditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
