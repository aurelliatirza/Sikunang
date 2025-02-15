import { Test, TestingModule } from '@nestjs/testing';
import { KabupatenKotaController } from './kabupaten-kota.controller';
import { KabupatenKotaService } from './kabupaten-kota.service';

describe('KabupatenKotaController', () => {
  let controller: KabupatenKotaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KabupatenKotaController],
      providers: [KabupatenKotaService],
    }).compile();

    controller = module.get<KabupatenKotaController>(KabupatenKotaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
