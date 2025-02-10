import { Test, TestingModule } from '@nestjs/testing';
import { KantorController } from './kantor.controller';
import { KantorService } from './kantor.service';

describe('KantorController', () => {
  let controller: KantorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KantorController],
      providers: [KantorService],
    }).compile();

    controller = module.get<KantorController>(KantorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
