import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNasabahDto } from './dto/create-nasabah.dto';
import { UpdateNasabahDto } from './dto/update-nasabah.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NasabahService {
  constructor(private readonly prisma: PrismaService) {}

  async createNasabah(dto: CreateNasabahDto) {
    return this.prisma.nasabah.create({
      data: { ...dto },
    });
  }

  async findNasabahByData(nama: string, no_telp: string, alamat: string) {
    const nasabah = await this.prisma.nasabah.findFirst({
        where: {
            namaNasabah: nama,
            no_telp: no_telp,
            alamat: alamat,
        },
    });

    return nasabah; // Bisa null jika tidak ditemukan
}




  async findAll() {
    return this.prisma.nasabah.findMany({
      include: {
        desa: { select: { nama: true }},
        karyawan: { select: {namaKaryawan: true} },
      }
    });
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
