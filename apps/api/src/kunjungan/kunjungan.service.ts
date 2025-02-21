import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateKunjunganDto } from './dto/create-kunjungan.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNasabahDto } from 'src/nasabah/dto/create-nasabah.dto';
import { NasabahService } from 'src/nasabah/nasabah.service';

@Injectable()
export class KunjunganService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly nasabahService: NasabahService, // 🔥 Tambahkan ini
    ) {}

    async createKunjungan(dto: CreateKunjunganDto, nasabahDto?: CreateNasabahDto) {
        let nasabah = null;
    
        if (nasabahDto) {
            nasabah = await this.nasabahService.findNasabahByData(
                nasabahDto.namaNasabah, 
                nasabahDto.no_telp, 
                nasabahDto.alamat
            );
            
            if (!nasabah) {
                nasabah = await this.nasabahService.createNasabah(nasabahDto);
            }
        }
    
        const idNasabah = nasabah?.id || dto.id_nasabah;
    
        // 🔍 Tambahkan pengecekan agar ID tidak kosong
        if (!idNasabah) {
            throw new BadRequestException("ID Nasabah tidak ditemukan atau tidak valid.");
        }
    
        console.log("🚀 ID Nasabah yang akan digunakan:", idNasabah);
        console.log("📦 Data kunjungan yang disimpan:", dto);
    
        try {
            const newKunjungan = await this.prisma.kunjungan.create({
                data: {
                    id_nasabah: idNasabah, // ✅ Pastikan selalu ada ID
                    hasilKunjungan: dto.hasilKunjungan,
                    foto_kunjungan: dto.foto_kunjungan,
                },
            });
    
            console.log("✅ Kunjungan berhasil disimpan:", newKunjungan);
            return newKunjungan;
        } catch (error) {
            console.error("❌ Error saat menyimpan kunjungan:", error);
            throw new BadRequestException("Gagal menyimpan data kunjungan.");
        }
    }
    
    
    

    async findAll() {
        return this.prisma.kunjungan.findMany({
            include: {
                nasabah: {
                    select: {
                        namaNasabah: true,
                        alamat: true,
                    },
                },
            },
        });
    }

    async findOne(id_kunjungan: number) {
        if (!id_kunjungan || isNaN(id_kunjungan)) {
          throw new Error("id_kunjungan harus berupa angka dan tidak boleh kosong.");
        }
      
        return this.prisma.kunjungan.findUnique({
          where: { id_kunjungan: Number(id_kunjungan) },
        });
      }
      

    async remove(id_kunjungan: number) {
        return this.prisma.kunjungan.delete({ where: { id_kunjungan } });
    }
}
