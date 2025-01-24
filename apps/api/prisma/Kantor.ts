import { DateTime } from 'luxon';

export const Kantor = [
  {
    id_kantor: 1,
    jenis_kantor: 'Pusat',
    createdAt: DateTime.now().setZone('Asia/Jakarta').toJSDate()
  },
  {
    id_kantor: 2,
    jenis_kantor: 'Kas',
    createdAt: DateTime.now().setZone('Asia/Jakarta').toJSDate()
  },
  {
    id_kantor: 3,
    jenis_kantor: 'Cabang',
    createdAt: DateTime.now().setZone('Asia/Jakarta').toJSDate()
  }
];
