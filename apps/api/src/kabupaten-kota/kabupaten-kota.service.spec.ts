import { Test, TestingModule } from '@nestjs/testing';
import { KabupatenKotaService } from './kabupaten-kota.service';

describe('KabupatenKotaService', () => {
  let service: KabupatenKotaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KabupatenKotaService],
    }).compile();

    service = module.get<KabupatenKotaService>(KabupatenKotaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
