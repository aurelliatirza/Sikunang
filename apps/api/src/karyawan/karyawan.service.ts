import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateKaryawanDto } from './dto/create-karyawan.dto';
import { UpdateKaryawanDto } from './dto/update-karyawan.dto';

@Injectable()
export class KaryawanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createKaryawanDto: CreateKaryawanDto) {
    return this.prisma.karyawan.create({
      data: {
        ...createKaryawanDto,
        nik: Number(createKaryawanDto.nik), // Pastikan tipe data sesuai
      },
    });
  }
  

  async findByNik(nik: number) {
    return this.prisma.karyawan.findFirst({
      where: { nik: nik },
      include: { kantor: true }, // Tambahkan jika ingin menampilkan kantor
    });
  }  
  

  async findAll() {
    return this.prisma.karyawan.findMany({
      include: {
        kantor: true,
        supervisor: { select: { namaKaryawan: true } },
        kepalaBagian: { select: { namaKaryawan: true } },
        direkturBisnis: { select: { namaKaryawan: true } }
      },
  
    });
  }

  async findOne(id: number) {
    return this.prisma.karyawan.findUnique({
      where: { nik: id },
      include: { kantor: true },
    });
  }

  async update(id: number, updateKaryawanDto: UpdateKaryawanDto) {
    try {
      const updatedKaryawan = await this.prisma.karyawan.update({
        where: { nik: id },
        data: updateKaryawanDto,
      });
      return { message: "Karyawan berhasil diperbarui", data: updatedKaryawan };
    } catch (error) {
      console.error("Error updating karyawan:", error);
      throw new Error("Gagal memperbarui karyawan, pastikan ID benar");
    }
  }
  
  async remove(id: number) {
    return this.prisma.karyawan.delete({
      where: { nik: id },
    });
  }
}
