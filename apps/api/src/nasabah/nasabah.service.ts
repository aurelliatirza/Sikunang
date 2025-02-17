import { Injectable } from '@nestjs/common';
import { CreateNasabahDto } from './dto/create-nasabah.dto';
import { UpdateNasabahDto } from './dto/update-nasabah.dto';

@Injectable()
export class NasabahService {
  create(createNasabahDto: CreateNasabahDto) {
    return 'This action adds a new nasabah';
  }

  findAll() {
    return `This action returns all nasabah`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nasabah`;
  }

  update(id: number, updateNasabahDto: UpdateNasabahDto) {
    return `This action updates a #${id} nasabah`;
  }

  remove(id: number) {
    return `This action removes a #${id} nasabah`;
  }
}
