import { Module } from '@nestjs/common';
import { KecamatanController } from './kecamatan.controller';
import { KecamatanService } from './kecamatan.service';
import { PrismaService } from '../prisma/prisma.service'; // Pastikan PrismaService sudah diimport

@Module({
  imports: [],
  controllers: [KecamatanController],
  providers: [KecamatanService, PrismaService],
})
export class KecamatanModule {}
