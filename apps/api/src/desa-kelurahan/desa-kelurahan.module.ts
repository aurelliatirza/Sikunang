import { Module } from '@nestjs/common';
import { DesaKelurahanService } from './desa-kelurahan.service';
import { DesaKelurahanController } from './desa-kelurahan.controller';

@Module({
  controllers: [DesaKelurahanController],
  providers: [DesaKelurahanService],
})
export class DesaKelurahanModule {}
