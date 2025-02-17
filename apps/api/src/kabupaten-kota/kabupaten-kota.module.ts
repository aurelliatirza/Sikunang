import { Module } from '@nestjs/common';
import { KabupatenKotaService } from './kabupaten-kota.service';
import { KabupatenKotaController } from './kabupaten-kota.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KabupatenKotaController],
  providers: [KabupatenKotaService],
  exports: [KabupatenKotaService],
})
export class KabupatenKotaModule {}
