import { Injectable } from '@nestjs/common';
import { CreateKecamatanDto } from './dto/create-kecamatan.dto';
import { UpdateKecamatanDto } from './dto/update-kecamatan.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class KecamatanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createKecamatanDto: CreateKecamatanDto) {
    return this.prisma.kecamatan.create({
      data: createKecamatanDto,
    });
  }

  async findAll() {
    return this.prisma.kecamatan.findMany();
  }

  // Menampilkan kecamatan dari kota/kabupaten terkait
  async getKecamatanByKabupatenKota(kabupatenKotaId: string) {
    return this.prisma.kecamatan.findMany({
      where: {kabupatenKotaId,},
    });
  }


  async findOne(id: string) {
    return this.prisma.kecamatan.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateKecamatanDto: UpdateKecamatanDto) {
    return this.prisma.kecamatan.update({
      where: { id },
      data: updateKecamatanDto,
    });
  }

  async remove(id: string) {
    return this.prisma.kecamatan.delete({
      where: { id },
    });
  }
}
