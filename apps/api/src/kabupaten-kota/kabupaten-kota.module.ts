import { Module } from '@nestjs/common';
import { KabupatenKotaService } from './kabupaten-kota.service';
import { KabupatenKotaController } from './kabupaten-kota.controller';

@Module({
  controllers: [KabupatenKotaController],
  providers: [KabupatenKotaService],
})
export class KabupatenKotaModule {}
