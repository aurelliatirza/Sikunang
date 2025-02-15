import { Injectable } from '@nestjs/common';
import { CreateKecamatanDto } from './dto/create-kecamatan.dto';
import { UpdateKecamatanDto } from './dto/update-kecamatan.dto';

@Injectable()
export class KecamatanService {
  create(createKecamatanDto: CreateKecamatanDto) {
    return 'This action adds a new kecamatan';
  }

  findAll() {
    return `This action returns all kecamatan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kecamatan`;
  }

  update(id: number, updateKecamatanDto: UpdateKecamatanDto) {
    return `This action updates a #${id} kecamatan`;
  }

  remove(id: number) {
    return `This action removes a #${id} kecamatan`;
  }
}
