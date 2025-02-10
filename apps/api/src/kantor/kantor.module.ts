import { Module } from '@nestjs/common';
import { KantorService } from './kantor.service';
import { KantorController } from './kantor.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KantorController],
  providers: [KantorService],
  exports: [KantorService], // (Opsional) Jika KantorService akan digunakan di module lain
})
export class KantorModule {}
