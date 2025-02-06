import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],  // Harus diekspor agar bisa digunakan di module lain
})
export class PrismaModule {}
