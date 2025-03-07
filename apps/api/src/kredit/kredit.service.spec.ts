import { Test, TestingModule } from '@nestjs/testing';
import { KreditService } from './kredit.service';

describe('KreditService', () => {
  let service: KreditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KreditService],
    }).compile();

    service = module.get<KreditService>(KreditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
