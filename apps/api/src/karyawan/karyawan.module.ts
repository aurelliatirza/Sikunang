import { Module } from '@nestjs/common';
import { KaryawanService } from './karyawan.service';
import { KaryawanController } from './karyawan.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KaryawanController],
  providers: [KaryawanService],
  exports: [KaryawanService], // (Opsional) Jika KaryawanService akan digunakan di module lain
})
export class KaryawanModule {}
