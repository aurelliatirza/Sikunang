// filepath: /Users/tirzaaurellia/Documents/PKL/Sikunang/apps/api/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { Kantor } from './Kantor';
import { Karyawan } from './Karyawan';

const prisma = new PrismaClient();

async function main() {
  // Insert data untuk tabel Kantor
  for (const kantor of Kantor) {
    try {
      await prisma.kantor.create({ data: kantor });
      console.log(`Berhasil menambahkan kantor: ${kantor.jenis_kantor}`);
    } catch (error) {
      console.error(`Gagal menambahkan kantor: ${kantor.jenis_kantor}`, error);
    }
  }

  // Insert data untuk tabel Karyawan
  for (const karyawan of Karyawan) {
    try {
      await prisma.karyawan.create({ data: karyawan });
      console.log(`Berhasil menambahkan karyawan: ${karyawan.namaKaryawan}`);
    } catch (error) {
      console.error(`Gagal menambahkan karyawan: ${karyawan.namaKaryawan}`, error);
    }
  }
}

main()
  .catch((e) => {
    console.error('Terjadi kesalahan:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });