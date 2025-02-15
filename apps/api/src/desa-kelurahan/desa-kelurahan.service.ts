import { Injectable } from '@nestjs/common';
import { CreateDesaKelurahanDto } from './dto/create-desa-kelurahan.dto';
import { UpdateDesaKelurahanDto } from './dto/update-desa-kelurahan.dto';

@Injectable()
export class DesaKelurahanService {
  create(createDesaKelurahanDto: CreateDesaKelurahanDto) {
    return 'This action adds a new desaKelurahan';
  }

  findAll() {
    return `This action returns all desaKelurahan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} desaKelurahan`;
  }

  update(id: number, updateDesaKelurahanDto: UpdateDesaKelurahanDto) {
    return `This action updates a #${id} desaKelurahan`;
  }

  remove(id: number) {
    return `This action removes a #${id} desaKelurahan`;
  }
}
