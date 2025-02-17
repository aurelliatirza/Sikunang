import { Test, TestingModule } from '@nestjs/testing';
import { LaporanKunjunganController } from './laporan-kunjungan.controller';
import { LaporanKunjunganService } from './laporan-kunjungan.service';

describe('LaporanKunjunganController', () => {
  let controller: LaporanKunjunganController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LaporanKunjunganController],
      providers: [LaporanKunjunganService],
    }).compile();

    controller = module.get<LaporanKunjunganController>(LaporanKunjunganController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
