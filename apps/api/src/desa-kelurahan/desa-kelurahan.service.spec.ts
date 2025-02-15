import { Test, TestingModule } from '@nestjs/testing';
import { DesaKelurahanService } from './desa-kelurahan.service';

describe('DesaKelurahanService', () => {
  let service: DesaKelurahanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DesaKelurahanService],
    }).compile();

    service = module.get<DesaKelurahanService>(DesaKelurahanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
