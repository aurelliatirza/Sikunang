import { Injectable } from '@nestjs/common';
import { CreateKabupatenKotaDto } from './dto/create-kabupaten-kota.dto';
import { UpdateKabupatenKotaDto } from './dto/update-kabupaten-kota.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class KabupatenKotaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createKabupatenKotaDto: CreateKabupatenKotaDto) {
    return this.prisma.kabupatenKota.create({
      data: createKabupatenKotaDto,
    });
  }
  async findAll() {
    return this.prisma.kabupatenKota.findMany();
  }

  async findOne(id: string) {
    return this.prisma.kabupatenKota.findUnique({
      where: {id},
    });
  }

  async update(id: string, updateKabupatenKotaDto: UpdateKabupatenKotaDto) {
    return this.prisma.kabupatenKota.update({
      where: {id},
      data: updateKabupatenKotaDto,
    })
  }

  async remove(id: string) {
    return this.prisma.kabupatenKota.delete({
      where: {id},
    });
  }
}
