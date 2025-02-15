import { Test, TestingModule } from '@nestjs/testing';
import { KecamatanController } from './kecamatan.controller';
import { KecamatanService } from './kecamatan.service';

describe('KecamatanController', () => {
  let controller: KecamatanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KecamatanController],
      providers: [KecamatanService],
    }).compile();

    controller = module.get<KecamatanController>(KecamatanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
