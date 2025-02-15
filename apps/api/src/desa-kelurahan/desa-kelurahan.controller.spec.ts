import { Test, TestingModule } from '@nestjs/testing';
import { DesaKelurahanController } from './desa-kelurahan.controller';
import { DesaKelurahanService } from './desa-kelurahan.service';

describe('DesaKelurahanController', () => {
  let controller: DesaKelurahanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesaKelurahanController],
      providers: [DesaKelurahanService],
    }).compile();

    controller = module.get<DesaKelurahanController>(DesaKelurahanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
