import { DateTime } from 'luxon';

export const Karyawan = [
    {
      nik: 456,
      namaKaryawan: 'Tirza Aurellia',
      jabatan: 'direkturBisnis',  // Pastikan ini sesuai dengan nilai enum
      id_kantor: 1,
      createdAt: DateTime.now().setZone('Asia/Jakarta').toJSDate()
    },
    {
      nik: 337,
      namaKaryawan: 'Suratih',
      jabatan: 'kabag',  // Pastikan ini sesuai dengan nilai enumkk
      nik_direkturBisnis: 456,
      id_kantor: 1,
      createdAt: DateTime.now().setZone('Asia/Jakarta').toJSDate()
    },
    {
      nik: 201,
      namaKaryawan: 'Prismamul',
      jabatan: 'spv',  // Pastikan ini sesuai dengan nilai enum
      nik_kabag: 337,
      nik_direkturBisnis: 456,
      id_kantor: 1,
      createdAt: DateTime.now().setZone('Asia/Jakarta').toJSDate()
    },
    {
      nik: 202,
      namaKaryawan: 'Adit',
      jabatan: 'spv',  // Pastikan ini sesuai dengan nilai enum
      nik_kabag: 337,
      nik_direkturBisnis: 456,
      id_kantor: 1,
      createdAt: DateTime.now().setZone('Asia/Jakarta').toJSDate()
    },
    {
      nik: 101,
      namaKaryawan: 'Mulyono',
      jabatan: 'marketing',  // Pastikan ini sesuai dengan nilai enum
      nik_SPV: 201,
      nik_kabag: 337,
      nik_direkturBisnis: 456,
      id_kantor: 1,
      createdAt: DateTime.now().setZone('Asia/Jakarta').toJSDate()
    },
    {
      nik: 102,
      namaKaryawan: 'Sugeng',
      jabatan: 'marketing',  // Pastikan ini sesuai dengan nilai enum
      nik_SPV: 202,
      nik_kabag: 337,
      nik_direkturBisnis: 456,
      id_kantor: 1,
      createdAt: DateTime.now().setZone('Asia/Jakarta').toJSDate()
    }
  ];
  