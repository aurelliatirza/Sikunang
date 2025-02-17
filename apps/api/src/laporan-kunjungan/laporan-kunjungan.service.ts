import { Injectable } from '@nestjs/common';
import { CreateLaporanKunjunganDto } from './dto/create-laporan-kunjungan.dto';
import { UpdateLaporanKunjunganDto } from './dto/update-laporan-kunjungan.dto';

@Injectable()
export class LaporanKunjunganService {
  create(createLaporanKunjunganDto: CreateLaporanKunjunganDto) {
    return 'This action adds a new laporanKunjungan';
  }

  findAll() {
    return `This action returns all laporanKunjungan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} laporanKunjungan`;
  }

  update(id: number, updateLaporanKunjunganDto: UpdateLaporanKunjunganDto) {
    return `This action updates a #${id} laporanKunjungan`;
  }

  remove(id: number) {
    return `This action removes a #${id} laporanKunjungan`;
  }
}
