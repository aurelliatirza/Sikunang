import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { KaryawanModule } from './karyawan/karyawan.module';
import { KantorModule } from './kantor/kantor.module';


@Module({
  imports: [AuthModule, UserModule, KaryawanModule, KantorModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
