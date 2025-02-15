import { Injectable } from '@nestjs/common';
import { CreateKabupatenKotaDto } from './dto/create-kabupaten-kota.dto';
import { UpdateKabupatenKotaDto } from './dto/update-kabupaten-kota.dto';

@Injectable()
export class KabupatenKotaService {
  create(createKabupatenKotaDto: CreateKabupatenKotaDto) {
    return 'This action adds a new kabupatenKota';
  }

  findAll() {
    return `This action returns all kabupatenKota`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kabupatenKota`;
  }

  update(id: number, updateKabupatenKotaDto: UpdateKabupatenKotaDto) {
    return `This action updates a #${id} kabupatenKota`;
  }

  remove(id: number) {
    return `This action removes a #${id} kabupatenKota`;
  }
}
