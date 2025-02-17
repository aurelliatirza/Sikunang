import { Test, TestingModule } from '@nestjs/testing';
import { LaporanKunjunganService } from './laporan-kunjungan.service';

describe('LaporanKunjunganService', () => {
  let service: LaporanKunjunganService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LaporanKunjunganService],
    }).compile();

    service = module.get<LaporanKunjunganService>(LaporanKunjunganService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
