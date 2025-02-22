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

    async createKunjungan(dto: CreateKunjunganDto) {
        if (!dto.id_nasabah) {
            throw new BadRequestException("ID Nasabah tidak ditemukan atau tidak valid.");
        }
    
        console.log("🚀 ID Nasabah yang akan digunakan:", dto.id_nasabah);
        console.log("📦 Data kunjungan yang disimpan:", dto);
    
        try {
            const newKunjungan = await this.prisma.kunjungan.create({
                data: {
                    id_nasabah: dto.id_nasabah,
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

    async getAllKunjungan() {
        return this.prisma.kunjungan.findMany({
            include: {
                nasabah: {
                    select: {
                        namaNasabah: true,
                        alamat: true,
                        namaUsaha: true,
                        no_telp: true,
                        karyawan: {
                            select: {
                                namaKaryawan: true,
                            },
                        },
                        desa: {
                            select: {
                                nama: true,
                                Kecamatan: {
                                    select: {
                                        nama: true,
                                        KabupatenKota: {
                                            select: {
                                                nama: true,
                                            },
                                        },
                                    },
                                },
                            }
                        }
                    },
                },
            },
        });
    }
    
    async findOne(id_kunjungan: number) {
        return this.prisma.kunjungan.findUnique({
            where: { id_kunjungan },
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
      

    async remove(id_kunjungan: number) {
        return this.prisma.kunjungan.delete({ where: { id_kunjungan } });
    }
}
