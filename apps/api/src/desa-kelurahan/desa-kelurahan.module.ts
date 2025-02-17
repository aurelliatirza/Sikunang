import { Module } from '@nestjs/common';
import { DesaKelurahanService } from './desa-kelurahan.service';
import { DesaKelurahanController } from './desa-kelurahan.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DesaKelurahanController],
  providers: [DesaKelurahanService],
})
export class DesaKelurahanModule {}
