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
    return this.prisma.nasabah.findFirst({
      where: {
        namaNasabah: nama,
        no_telp: no_telp,
        alamat: alamat,
      },
      include: {
        desa: {
          include: {
            Kecamatan: {
              include: {
                KabupatenKota: true,
              },
            },
          },
        },
        karyawan: { select: { namaKaryawan: true } },
      },
    });
  }
  


  async findAll() {
    return this.prisma.nasabah.findMany({
      include: {
        desa: { select: { nama: true }},
        karyawan: { select: {namaKaryawan: true} },
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.nasabah.findUnique({
      where: { id_nasabah: id },
      include: {
        desa: {
          include: {
            Kecamatan: {
              include: {
                KabupatenKota: true,
              },
            },
          },
        },
        karyawan: { select: { namaKaryawan: true } },
      },
    });
  }
  

  async update(id: number, updateNasabahDto: UpdateNasabahDto) {
    try {
        console.log("Updating nasabah with id:", id);
        console.log("Data to update:", updateNasabahDto);

        const updatedNasabah = await this.prisma.nasabah.update({
            where: { id_nasabah: id },
            data: updateNasabahDto,
        });

        console.log("Nasabah updated:", updatedNasabah);

        return { message: "Data nasabah berhasil diupdate", data: updatedNasabah };
    } catch (error) {
        console.error("Error updating nasabah:", error);
        throw new BadRequestException("Gagal memperbarui data nasabah, pastikan ID benar");
    }
}

  
  

  remove(id: number) {
    return `This action removes a #${id} nasabah`;
  }
}
