import { PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';

const prisma = new PrismaClient();

const Kantor = [
  { id_kantor: 1, jenis_kantor: 'Kantor Pusat' },
  { id_kantor: 2, jenis_kantor: 'Kantor Cabang'},
  { id_kantor: 3, jenis_kantor: 'Kantor Kas'},
];

const Karyawan = [
  { nik: 456, namaKaryawan: 'Tirza Aurellia', jabatan: 'direkturBisnis', id_kantor: 1, createdAt: DateTime.now().setZone('Asia/Jakarta').toJSDate() },
  { nik: 337, namaKaryawan: 'Suratih', jabatan: 'kabag', nik_direkturBisnis: 456, id_kantor: 1, createdAt: DateTime.now().setZone('Asia/Jakarta').toJSDate() },
  { nik: 201, namaKaryawan: 'Prismamul', jabatan: 'spv', nik_kabag: 337, nik_direkturBisnis: 456, id_kantor: 1, createdAt: DateTime.now().setZone('Asia/Jakarta').toJSDate() },
  { nik: 202, namaKaryawan: 'Adit', jabatan: 'spv', nik_kabag: 337, nik_direkturBisnis: 456, id_kantor: 1, createdAt: DateTime.now().setZone('Asia/Jakarta').toJSDate() },
  { nik: 101, namaKaryawan: 'Mulyono', jabatan: 'marketing', nik_SPV: 201, nik_kabag: 337, nik_direkturBisnis: 456, id_kantor: 1, createdAt: DateTime.now().setZone('Asia/Jakarta').toJSDate() },
  { nik: 102, namaKaryawan: 'Sugeng', jabatan: 'marketing', nik_SPV: 202, nik_kabag: 337, nik_direkturBisnis: 456, id_kantor: 1, createdAt: DateTime.now().setZone('Asia/Jakarta').toJSDate() },
];

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
