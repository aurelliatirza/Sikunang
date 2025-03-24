import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateKunjunganDto } from './dto/create-kunjungan.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { NasabahService } from 'src/nasabah/nasabah.service';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateKunjunganDto } from './dto/update-kunjungan.dto';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

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
                        id_nasabah: true,
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

    //Fungsi untuk menghitung jumlah kunjungan yang dilakukan oleh seorang karyawan bulanan
    async totalKunjunganKaryawanBulanan() {
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Awal bulan ini
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Akhir bulan ini
    
            const data = await this.prisma.kunjungan.findMany({
                where: {
                    createdAt: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                    },
                },
                include: {
                    nasabah: {
                        select: {
                            karyawan: {
                                select: {
                                    nik: true,
                                    namaKaryawan: true,
                                },
                            },
                        },
                    },
                },
            });
    
            // Menghitung jumlah kunjungan per karyawan
            const result = data.reduce((acc, item) => {
                // Pastikan `nasabah` dan `karyawan` tidak null
                if (!item.nasabah || !item.nasabah.karyawan) return acc;
    
                const nik = item.nasabah.karyawan.nik;
                const namaKaryawan = item.nasabah.karyawan.namaKaryawan;
    
                if (!acc[nik]) {
                    acc[nik] = {
                        nik,
                        namaKaryawan,
                        totalKunjungan: 0,
                    };
                }
                acc[nik].totalKunjungan++;
                return acc;
            }, {});
    
            // Ubah dari objek ke array dan kembalikan hasilnya
            return Object.values(result);
        } catch (error) {
            console.error("Error fetching total kunjungan:", error);
            return [];
        }
    }
    

    // Method untuk mendapatkan path foto kunjungan
    async getFotoPath(filename: string): Promise<string> {
        const folderPath = '/Users/tirzaaurellia/Documents/Foto Test Sikunang';
        return path.join(folderPath, filename);
    }

    async updateKunjungan(id_kunjungan: number, data: UpdateKunjunganDto) {
        try {
            console.log("Updating kunjungan with id_kunjungan:", id_kunjungan);
            console.log("Data to update:", data);
    
            const { hasilKunjungan, foto_kunjungan, id_nasabah, ...nasabahData } = data;
    
            // Update tabel Kunjungan jika ada perubahan pada hasilKunjungan atau foto_kunjungan
            if (hasilKunjungan || foto_kunjungan) {
                await this.prisma.kunjungan.update({
                    where: { id_kunjungan },
                    data: { hasilKunjungan, foto_kunjungan },
                });
            }
    
            // Update tabel Nasabah jika ada data nasabah yang berubah
            if (Object.keys(nasabahData).length > 0 && id_nasabah) {
                await this.prisma.nasabah.update({
                    where: { id_nasabah },
                    data: nasabahData,
                });
            }
    
            return { message: "Data berhasil diperbarui" };
        } catch (error) {
            console.error("Error updating data:", error);
            throw new BadRequestException("Gagal memperbarui data, pastikan ID benar");
        }
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


    async cetakLaporan(startDate: string, endDate: string, nikKaryawan: string, namaKaryawan: string, role: string) {
        const fonts = {
            Roboto: {
                normal: "fonts/Roboto-Regular.ttf",
                bold: "fonts/Roboto-Medium.ttf",
                italics: "fonts/Roboto-Italic.ttf",
                bolditalics: "fonts/Roboto-MediumItalic.ttf",
            },
        };
    
        const printer = new PdfPrinter(fonts);
    
        // Ambil data kunjungan berdasarkan tanggal dan NIK karyawan
        const kunjunganData = await this.prisma.kunjungan.findMany({
            where: {
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
                nasabah: {
                    karyawan: {
                        nik: Number(nikKaryawan),
                    },
                },
            },
            include: {
                nasabah: {
                    select: {
                        namaNasabah: true,
                        alamat: true,
                        namaUsaha: true,
                        no_telp: true,
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
                },
            },
        });
    
        // Ambil nama supervisor dari karyawan yang dipilih
        const supervisorNama = kunjunganData.length > 0 ? kunjunganData[0].nasabah.karyawan.supervisor?.namaKaryawan || "-" : "-";
    
        // Struktur data untuk PDF
        const docDefinition: TDocumentDefinitions = {
            content: [
                { text: "Laporan Kunjungan", style: "header", alignment: "center" },
                { text: `Nama Karyawan: ${namaKaryawan}`, style: "subheader" },
                { text: `Tanggal Mulai: ${startDate}`, style: "subheader" },
                { text: `Tanggal Selesai: ${endDate}\n\n`, style: "subheader" },
                {
                    table: {
                        headerRows: 1,
                        widths: ["auto", "auto", "auto", "auto", "auto", "auto"],
                        body: [
                            ["No", "Nama Nasabah", "Alamat", "Nama Usaha", "Nama Karyawan", "Hasil Kunjungan", "Waktu Kunjungan"],
                            ...kunjunganData.map((item, index) => [
                                index + 1,
                                item.nasabah.namaNasabah,
                                `${item.nasabah.alamat}, ${item.nasabah.desa.nama}, 
                                ${item.nasabah.desa.Kecamatan.nama}, 
                                ${item.nasabah.desa.Kecamatan.KabupatenKota.nama}`,
                                item.nasabah.namaUsaha,
                                item.nasabah.karyawan.namaKaryawan,
                                item.hasilKunjungan || "-",
                                new Date(item.createdAt).toLocaleString('id-ID', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                }),
                            ]),
                        ],
                    },
                },
                { text: "\n\nSupervisor", style: "subheader", alignment: "left" },
                {
                    text: `\n\n( ${supervisorNama} )`,
                    alignment: "left",
                    margin: [0, 20, 0, 0],
                },
            ],
            styles: {
                header: { fontSize: 16, bold: true, alignment: "center" },
                subheader: { fontSize: 12, italics: true, margin: [0, 5, 0, 10] },
            },
        };
    
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const pdfPath = "laporan_kunjungan.pdf";
        pdfDoc.pipe(fs.createWriteStream(pdfPath));
        pdfDoc.end();
    
        return {
            message: "Laporan berhasil dicetak",
            filePath: pdfPath,
        };
    }
    
}
