import { Module } from '@nestjs/common';
import { LaporanKunjunganService } from './laporan-kunjungan.service';
import { LaporanKunjunganController } from './laporan-kunjungan.controller';

@Module({
  controllers: [LaporanKunjunganController],
  providers: [LaporanKunjunganService],
})
export class LaporanKunjunganModule {}
