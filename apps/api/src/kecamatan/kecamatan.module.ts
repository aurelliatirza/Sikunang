import { Module } from '@nestjs/common';
import { KecamatanService } from './kecamatan.service';
import { KecamatanController } from './kecamatan.controller';

@Module({
  controllers: [KecamatanController],
  providers: [KecamatanService],
})
export class KecamatanModule {}
