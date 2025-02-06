import { DateTime } from 'luxon';

export const Karyawan = [
    {
      nik: 456,
      namaKaryawan: 'Maha Sagara Lim',
      jabatan: 'hrd',  
      id_kantor: 1,
      createdAt: DateTime.now().setZone('Asia/Jakarta').toJSDate()
    }
  ];
  