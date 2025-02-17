import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { KaryawanModule } from './karyawan/karyawan.module';
import { KantorModule } from './kantor/kantor.module';
import { ConfigModule } from '@nestjs/config';
import { KabupatenKotaModule } from './kabupaten-kota/kabupaten-kota.module';
import { KecamatanModule } from './kecamatan/kecamatan.module';
import { DesaKelurahanModule } from './desa-kelurahan/desa-kelurahan.module';
import { LaporanKunjunganModule } from './laporan-kunjungan/laporan-kunjungan.module';
import { NasabahModule } from './nasabah/nasabah.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // ✅ Konfigurasi ConfigModule agar `.env` bisa digunakan
    AuthModule,
    UserModule,
    KaryawanModule,
    KantorModule,
    KabupatenKotaModule,
    KecamatanModule,
    DesaKelurahanModule,
    LaporanKunjunganModule,
    NasabahModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
