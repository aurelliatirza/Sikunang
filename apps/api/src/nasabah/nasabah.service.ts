import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNasabahDto } from './dto/create-nasabah.dto';
import { UpdateNasabahDto } from './dto/update-nasabah.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as path from 'path';


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
    console.log('findOne called with id:', id);
  
    if (!id || isNaN(id)) {
      throw new Error('ID tidak boleh null, undefined, atau NaN');
    }
  
    return this.prisma.nasabah.findUnique({
      where: { id_nasabah: id },
      include: {
        desa: {
          select: {
            id: true,
            nama: true,
            Kecamatan: {
              select: {
                id: true,
                nama: true,
                KabupatenKota: {
                  select: {
                    id: true,
                    nama: true,
                  },
                },
              },
            },
          },
        },
        karyawan: { 
          select: { 
            namaKaryawan: true,
            supervisor: {
              select: {
                namaKaryawan: true,
              },
            },
          },
        },
      },
    });
  }
  
  //Buat fungsi baru untuk mengambil data kunjungan nasabah yang banyak
  async KunjunganNasabah() {
    try {
      const data = await this.prisma.nasabah.findMany({
        include: {
          desa: { select: { nama: true } },
          karyawan: { select: { 
            namaKaryawan: true,
            nik_SPV: true,
            nik_kabag: true,
            nik_direkturBisnis: true,
            nik_kacab: true,
            nik_direkturUtama: true,
           } },
          kunjungan: {
            select: {
              id_kunjungan: true,
              createdAt: true,
              hasilKunjungan: true,
            },
          },
        },
      });
  
      // Tambahkan jumlah kunjungan untuk setiap nasabah
      const result = data.map((nasabah) => ({
        ...nasabah,
        jumlahKunjungan: nasabah.kunjungan.length, // Hitung jumlah kunjungan
      }));
  
      console.log('Data Kunjungan dengan Jumlah:', result);
      return result;
    } catch (error) {
      console.error('Error fetching kunjungan nasabah:', error);
      throw new Error('Gagal mengambil data kunjungan nasabah');
    }
  }
  
  //Buat fungsi baru untuk mengambil data kunjungan nasabah berdasarkan ID
  async getKunjunganNasabah(id: number) {
    try {
      const nasabah = await this.prisma.nasabah.findUnique({
        where: { id_nasabah: id },
        include: {
          kunjungan: {
            select: {
              id_kunjungan: true,
              hasilKunjungan: true,
              foto_kunjungan: true,
              createdAt: true,
            },
          },
        },
      });
  
      if (!nasabah) {
        throw new Error('Nasabah tidak ditemukan');
      }
  
      return nasabah;
    } catch (error) {
      console.error('Error fetching kunjungan:', error);
      throw new Error('Gagal mengambil data kunjungan nasabah');
    }
  }

  // Method untuk mendapatkan path foto kunjungan
  async getFotoPath(filename: string): Promise<string> {
      const folderPath = '/Users/tirzaaurellia/Documents/Foto Test Sikunang';
      return path.join(folderPath, filename);
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
