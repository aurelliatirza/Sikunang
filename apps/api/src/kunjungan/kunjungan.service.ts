import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateKunjunganDto } from './dto/create-kunjungan.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { NasabahService } from 'src/nasabah/nasabah.service';
import * as fs from 'fs';
import * as path from 'path';

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
                                nik_SPV: true,
                                nik_kabag: true,
                                nik_direkturBisnis: true,
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
            where: {id_kunjungan},
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
                                nik_SPV: true,
                                nik_kabag: true,
                                nik_direkturBisnis: true,
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

    // Method untuk mendapatkan path foto kunjungan
    async getFotoPath(filename: string): Promise<string> {
        const folderPath = '/Users/tirzaaurellia/Documents/Foto Test Sikunang';
        return path.join(folderPath, filename);
    }
      

    async remove(id_kunjungan: number) {
        // Ambil data kunjungan termasuk path foto
        const kunjungan = await this.prisma.kunjungan.findUnique({
            where: { id_kunjungan },
            select: { foto_kunjungan: true }, // Pastikan 'foto_kunjungan' nama kolomnya benar
        });
    
        if (!kunjungan) {
            throw new NotFoundException('Data kunjungan tidak ditemukan.');
        }
    
        // Hapus data dari database
        await this.prisma.kunjungan.delete({ where: { id_kunjungan } });
    
        // Hapus file foto dari sistem
        if (kunjungan.foto_kunjungan) {
            const filePath = path.join('/Users/tirzaaurellia/Documents/Foto Test Sikunang', kunjungan.foto_kunjungan);
            console.log('🧹 Mencoba menghapus file foto:', filePath);
    
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log('✅ File foto berhasil dihapus:', filePath);
                } else {
                    console.warn('⚠️ File foto tidak ditemukan di path:', filePath);
                }
            } catch (err) {
                console.error('❌ Gagal menghapus file foto:', err);
            }
        }
    
        return { message: 'Data kunjungan dan file foto berhasil dihapus.' };
    }
    
}
