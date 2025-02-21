import { Module } from '@nestjs/common';
import { KunjunganService } from './kunjungan.service';
import { KunjunganController } from './kunjungan.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { NasabahService } from 'src/nasabah/nasabah.service';

@Module({
  controllers: [KunjunganController],
  providers: [KunjunganService, PrismaService, NasabahService], // 🔥 Tambahkan NasabahService
})
export class KunjunganModule {}
