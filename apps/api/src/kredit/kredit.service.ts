import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateKreditDto } from './dto/create-kredit.dto';
import { UpdateKreditDto } from './dto/update-kredit.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Kredit } from '@prisma/client';
import { UpdateSlikCheckDto } from './dto/updateSlik.dto';

@Injectable()
export class KreditService {
  constructor(
    private readonly prisma: PrismaService,
  ){}

  async createKredit(createKreditDto: CreateKreditDto) {
    return this.prisma.kredit.create({
      data: {
        id_nasabah: createKreditDto.id_nasabah,
        nominal_pengajuan: createKreditDto.nominal_pengajuan,
        tenor_pengajuan: createKreditDto.tenor_pengajuan,
        id_karyawan_pengajuan: createKreditDto.id_karyawan_pengajuan,
      },
    });
  }

  async getAllKredit(): Promise<Kredit[]> {
    return this.prisma.kredit.findMany({
      include: {
        nasabah: {
          include: {
            karyawan: true,
            desa: {
              include: {
                Kecamatan: {
                  include: {
                    KabupatenKota: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.kredit.findUnique({
      where: {id_kredit: id}
    });
  }

  update(id: number, updateKreditDto: UpdateKreditDto) {
    return `This action updates a #${id} kredit`;
  }

  async updateSlikCheck(id: number, updateSlikCheckDto: UpdateSlikCheckDto) {
    const kredit = await this.prisma.kredit.findUnique({
      where: { id_kredit: id },
    });
  
    if (!kredit) {
      throw new NotFoundException("Kredit tidak ditemukan");
    }
  
    return this.prisma.kredit.update({
      where: { id_kredit: id },
      data: {
        status_Slik: updateSlikCheckDto.status_Slik,
        id_karyawan_slik: updateSlikCheckDto.id_karyawan_slik ?? kredit.id_karyawan_slik,
        updatedAtSlik: new Date(),
      },
    });
  }
  

  remove(id: number) {
    return `This action removes a #${id} kredit`;
  }
}
