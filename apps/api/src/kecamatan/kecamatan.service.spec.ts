import { Test, TestingModule } from '@nestjs/testing';
import { KecamatanService } from './kecamatan.service';

describe('KecamatanService', () => {
  let service: KecamatanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KecamatanService],
    }).compile();

    service = module.get<KecamatanService>(KecamatanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
