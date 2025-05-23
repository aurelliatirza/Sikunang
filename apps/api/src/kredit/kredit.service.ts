import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateKreditDto } from './dto/create-kredit.dto';
import { UpdateKreditDto } from './dto/update-kredit.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Kredit } from '@prisma/client';
import { UpdateSlikCheckDto } from './dto/updateSlik.dto';
import { UpdateAnalisisSlik } from './dto/updateAnalisisSlik.dto';
import { UpdateVisitDto } from './dto/updateVisit.dto';
import { UpdateProposalDto } from './dto/updateProposal.dto';
import { UpdatePersetujuan } from './dto/updatePersetujuan.dto';


@Injectable()
export class KreditService {
  constructor(
    private readonly prisma: PrismaService,
  ){}

  async createKredit(createKreditDto: CreateKreditDto) {
    return this.prisma.kredit.create({
      data: {
        nominal_pengajuan: createKreditDto.nominal_pengajuan,
        tenor_pengajuan: createKreditDto.tenor_pengajuan,
        nasabah: {
          connect: { id_nasabah: createKreditDto.id_nasabah },
        },
        karyawan_pengajuan: {
          connect: { nik: createKreditDto.id_karyawan_pengajuan },
        },
        updatedAtSlik: new Date(),
        updatedAtAnalisisSlik: new Date(),
        updatedAtVisitNasabah: new Date(),
        updatedAtProposalKredit: new Date(),
        updatedAtPersetujuansatu: new Date(),
        updatedAtPersetujuandua: new Date(),
        updatedAtPersetujuantiga: new Date(),
        status_Slik: 'belum_ditinjau',
        status_analisisSlik: 'belum_dianalisis',
        status_visitNasabah: 'belum_dilakukan',
        status_proposalKredit: 'belum_diajukan',
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

  // seleksi tabel Slik
  async getSlikKredit(): Promise<Kredit[]> {
    return this.prisma.kredit.findMany({
      where: {
        status_pengajuan: { not: "dibatalkan" }, // Hanya ambil yang tidak dibatalkan
      },
      include: {
        karyawan_pengajuan: { // ⬅️ Tambahkan ini
          include: {
            kantor: true, // ⬅️ Tambahkan kantor
          },
        },
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
  
  //Seleksi tabel analisis
  async getAnalisisSlikKredit(): Promise<Kredit[]> {
    return this.prisma.kredit.findMany({
      where: {
        status_Slik: { not: "belum_ditinjau" }, // Filter data yang tidak dibatalkan
      },
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

  //seleksi tabel visit
  async getVisit(): Promise<Kredit[]> {
    return this.prisma.kredit.findMany({
      where: {
        status_analisisSlik: { notIn: ["belum_dianalisis", "tolak"] }, // Filter data yang tidak dibatalkan
      },
      include: {
        nasabah: {
          include: {
            karyawan: {
              include: {
                kantor: true
              }
            },
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

  //seleksi tabel Proposal
  async getProposal(): Promise<Kredit[]> {
    return this.prisma.kredit.findMany({
      where: {
        status_visitNasabah: { notIn: ["belum_dilakukan", "tolak"] }, // Filter data yang tidak dibatalkan
      },
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

  //Seleksi tabel persetujuan satu
  async getPersetujuanSatu(): Promise<Kredit[]> {
    return this.prisma.kredit.findMany({
      where: {
        status_proposalKredit: "lanjut", // Filter data yang tidak dibatalkan
      },
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
        karyawan_pengajuan: true,
      },
    });
  }

  async getPersetujuanDua(): Promise<Kredit[]> {
    return this.prisma.kredit.findMany({
      where: {
        AND: [
          { nominal_pengajuan: { gt: 25000000 } },
          { status_persetujuansatu: "setuju" }
        ]
      },      
      include: {
        nasabah: {
          include: {
            karyawan: {
              include: {
                kantor: true
              }
            },
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
        karyawan_pengajuan: { 
          select: { // ✅ Menggunakan hanya `select`
            nik: true,
            namaKaryawan: true,
            jabatan: true,
            kantor: true // Tetap bisa dipilih di dalam `select`
          }
        }
      },
    });
  }

  async getPersetujuanTiga(): Promise<Kredit[]> {
    return this.prisma.kredit.findMany({
      where: {
        AND: [
          { status_persetujuandua: "setuju" }, // Status harus setuju terlebih dahulu
          {
            OR: [
              {
                AND: [
                  { karyawan_pengajuan: { kantor: { jenis_kantor: "Pusat" } } },
                  { nominal_pengajuan: { gt: 50000000 } } // Jika pusat, nominal > 50jt
                ]
              },
              {
                AND: [
                  { karyawan_pengajuan: { kantor: { jenis_kantor: { in: ["Cabang", "Kas"] } } } },
                  { nominal_pengajuan: { gt: 75000000 } } // Jika cabang, nominal > 75jt
                ]
              }
            ]
          }
        ]
      },
      include: {
        nasabah: {
          include: {
            karyawan: {
              include: {
                kantor: true
              }
            },
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
        karyawan_pengajuan: { 
          select: {
            nik: true,
            namaKaryawan: true,
            jabatan: true,
            kantor: true
          }
        }
      },
    });
  }

  //Fungsi menghitung total nominal disetujui di bulan tertentu oleh karyawan tertentu
  async totalPersetujuanKaryawanBulanan() {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
      const data = await this.prisma.kredit.findMany({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        include: {
          karyawan_pengajuan: {
            select: {
              nik: true,
              namaKaryawan: true,
              nik_SPV: true,
              nik_kabag: true,
              nik_kacab: true,
              nik_direkturBisnis: true,
              nik_direkturUtama: true,
            },
          },
        },
      });
  
      // Menghitung total nominal disetujui per karyawan
      const result = data.reduce((acc, kredit) => {
        const nik = kredit.karyawan_pengajuan.nik;
        const namaKaryawan = kredit.karyawan_pengajuan.namaKaryawan;
        
        if (!acc[nik]) {
          acc[nik] = {
            nik,
            nik_SPV: kredit.karyawan_pengajuan.nik_SPV,
            nik_kabag: kredit.karyawan_pengajuan.nik_kabag,
            nik_kacab: kredit.karyawan_pengajuan.nik_kacab,
            nik_direkturBisnis: kredit.karyawan_pengajuan.nik_direkturBisnis,
            nik_direkturUtama: kredit.karyawan_pengajuan.nik_direkturUtama,
            namaKaryawan,
            total_nominal_disetujui: 0,  // ✅ Ganti nama variabel
          };
        }
        acc[nik].total_nominal_disetujui += kredit.nominal_disetujui ?? 0; // ✅ Gunakan nominal_disetujui
        return acc;
      }, {});
  
      return Object.values(result);
    } catch (error) {
      console.error("Error fetching total persetujuan:", error);
      return [];
    }
  }
  

  //Fungsi menghitung jumlah aplikasi pengajuan yang masuk perbulan
  async totalPengajuanKaryawanBulanan() {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Awal bulan ini
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Akhir bulan ini
  
      const data = await this.prisma.kredit.findMany({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        include: {
          karyawan_pengajuan: {
            select: {
              nik: true,
              namaKaryawan: true,
              nik_SPV: true,
              nik_kabag: true,
              nik_kacab: true,
              nik_direkturBisnis: true,
              nik_direkturUtama: true,
            },
          },
        },
      });
  
      // Menghitung jumlah pengajuan per karyawan (pakai length)
      const result = data.reduce((acc, kredit) => {
        const nik = kredit.karyawan_pengajuan.nik;
        const namaKaryawan = kredit.karyawan_pengajuan.namaKaryawan;
  
        if (!acc[nik]) {
          acc[nik] = {
            nik,
            nik_SPV: kredit.karyawan_pengajuan.nik_SPV,
            nik_kabag: kredit.karyawan_pengajuan.nik_kabag,
            nik_kacab: kredit.karyawan_pengajuan.nik_kacab,
            nik_direkturBisnis: kredit.karyawan_pengajuan.nik_direkturBisnis,
            nik_direkturUtama: kredit.karyawan_pengajuan.nik_direkturUtama,
            namaKaryawan,
            jumlah_pengajuan: 0, // Hitung jumlah pengajuan
          };
        }
        acc[nik].jumlah_pengajuan += 1; // Tambah 1 untuk setiap pengajuan
        return acc;
      }, {});
  
      // Ubah dari objek ke array
      return Object.values(result);
    } catch (error) {
      console.error("Error fetching total pengajuan:", error);
      return [];
    }
  }
  
  
  
  async findOne(id_kredit: number) {
    console.log("Fetching kredit dengan id_kredit:", id_kredit); // Debugging
  
    const kredit = await this.prisma.kredit.findUnique({
      where: { id_kredit: id_kredit }, // Pastikan sesuai dengan skema Prisma
    });
  
    console.log("Hasil pencarian:", kredit); // Debugging hasil query
  
    return kredit;
  }  
  

  async update(id: number, updateKreditDto: UpdateKreditDto) {
    const kredit = await this.prisma.kredit.findUnique({
      where: { id_kredit: id },
    });
  
    if (!kredit) {
      throw new NotFoundException("Kredit tidak ditemukan");
    }
    return this.prisma.kredit.update({
      where: { id_kredit: id },
      data: {
        status_pengajuan: updateKreditDto.status_pengajuan,
        tenor_pengajuan: updateKreditDto.tenor_pengajuan,
        nominal_pengajuan: updateKreditDto.nominal_pengajuan
      },
    });
  }

  //Update Slik
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

  //Update Analisis Slik
  async updateAnalisisSlik(id: number, updateAnalisisSlik: UpdateAnalisisSlik) {
    const kredit = await this.prisma.kredit.findUnique({
      where: { id_kredit: id },
    });
  
    if (!kredit) {
      throw new NotFoundException("Kredit tidak ditemukan");
    }
  
    return this.prisma.kredit.update({
      where: { id_kredit: id },
      data: {
        status_analisisSlik: updateAnalisisSlik.status_analisisSlik,
        id_karyawan_analisisSlik: updateAnalisisSlik.id_karyawan_analisisSlik ?? kredit.id_karyawan_analisisSlik,
        updatedAtAnalisisSlik: new Date(),
      },
    });
  }

  async updateVisit(id: number, updateVisit: UpdateVisitDto) {
    try {
      const kredit = await this.prisma.kredit.findUnique({
        where: { id_kredit: id },
      });
  
      if (!kredit) {
        throw new NotFoundException("Kredit tidak ditemukan");
      }
  
      return await this.prisma.kredit.update({
        where: { id_kredit: id },
        data: {
          status_visitNasabah: updateVisit.status_visitNasabah,
          id_karyawan_visitNasabah: updateVisit.id_karyawan_visitNasabah ?? kredit.id_karyawan_visitNasabah,
          updatedAtVisitNasabah: new Date(),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException("Gagal memperbarui data visit", error.message);
    }
  }
  
  //Update Proposal
  async updateProposal(id: number, updateProposal: UpdateProposalDto) {
    try {
      const kredit = await this.prisma.kredit.findUnique({
        where: { id_kredit: id },
      });
  
      if (!kredit) {
        throw new NotFoundException("Kredit tidak ditemukan");
      }
  
      return await this.prisma.kredit.update({
        where: { id_kredit: id },
        data: {
          status_proposalKredit: updateProposal.status_proposalKredit,
          id_karyawan_proposalKredit: updateProposal.id_karyawan_proposalKredit ?? kredit.id_karyawan_proposalKredit,
          updatedAtProposalKredit: new Date(),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException("Gagal memperbarui data proposal", error.message);
    }
  }
  
    async updatePersetujuan(
      id: number,
      step: "satu" | "dua" | "tiga",
      updateData: UpdatePersetujuan
  ) {
      try {
          const kredit = await this.prisma.kredit.findUnique({
              where: { id_kredit: id },
          });

          if (!kredit) {
              throw new NotFoundException("Kredit tidak ditemukan");
          }

          const now = new Date();
          const data: any = {};

          switch (step) {
              case "satu":
                  data.status_persetujuansatu = updateData.status_persetujuansatu || "belum_disetujui";
                  data.id_karyawan_persetujuansatu = updateData.id_karyawan_persetujuansatu ?? kredit.id_karyawan_persetujuansatu;
                  data.updatedAtPersetujuansatu = now;
                  break;
              case "dua":
                  data.status_persetujuandua = updateData.status_persetujuandua || "belum_disetujui";
                  data.id_karyawan_persetujuandua = updateData.id_karyawan_persetujuandua ?? kredit.id_karyawan_persetujuandua;
                  data.updatedAtPersetujuandua = now;
                  break;
              case "tiga":
                  data.status_persetujuantiga = updateData.status_persetujuantiga || "belum_disetujui";
                  data.id_karyawan_persetujuantiga = updateData.id_karyawan_persetujuantiga ?? kredit.id_karyawan_persetujuantiga;
                  data.updatedAtPersetujuantiga = now;
                  break;
              default:
                console.error("🚨 Step tidak valid:", step);
                throw new BadRequestException("Jenis persetujuan tidak valid");
          }

          const statusField = `status_persetujuan${step}` as keyof UpdatePersetujuan;

          //Kalau setuju ada nominal tapi sesuai action di FE
          // Jika status diubah menjadi "belum_disetujui", reset tenor dan nominal ke 0
          if (updateData[statusField] === "belum_disetujui") {
            data.tenor_disetujui = 0;
            data.nominal_disetujui = 0;
          } 
          // Jika status diubah menjadi "setuju", gunakan nilai dari request atau pertahankan nilai lama
          else if (updateData[statusField] === "setuju") {
            data.tenor_disetujui = updateData.tenor_disetujui ?? kredit.tenor_disetujui;
            data.nominal_disetujui = updateData.nominal_disetujui ?? kredit.nominal_disetujui;
          } 
          else {
              data.tenor_disetujui = kredit.tenor_disetujui ?? 0;
              data.nominal_disetujui = kredit.nominal_disetujui ?? 0;
          }

          console.log("📌 Data yang akan diupdate:", data);

          const updatedKredit = await this.prisma.kredit.update({
              where: { id_kredit: id },
              data,
          });

          console.log("✅ Data setelah update:", updatedKredit);

          return updatedKredit;
      } catch (error) {
          console.error("Error Prisma:", error);
          throw new InternalServerErrorException("Terjadi kesalahan saat memperbarui persetujuan");
      }
  }



  async KreditKaryawan(startDate?: string, endDate?: string) {
    try {
      const whereCondition: any = {};
  
      if (startDate || endDate) {
        whereCondition.createdAt = {};
  
        if (startDate && endDate) {
          if (startDate === endDate) {
            // Jika startDate dan endDate sama, gunakan equals
            whereCondition.createdAt.equals = new Date(startDate);
          } else {
            // Jika berbeda, gunakan gte dan lte
            whereCondition.createdAt.gte = new Date(startDate);
            const endDateObj = new Date(endDate);
            endDateObj.setHours(23, 59, 59, 999); // Akhir hari agar inklusif
            whereCondition.createdAt.lte = endDateObj;
          }
        } else if (startDate) {
          whereCondition.createdAt.gte = new Date(startDate);
        } else if (endDate) {
          const endDateObj = new Date(endDate);
          endDateObj.setHours(23, 59, 59, 999);
          whereCondition.createdAt.lte = endDateObj;
        }
      }
  
      console.log("Fetching data with conditions:", whereCondition);
  
      const data = await this.prisma.kredit.findMany({
        where: whereCondition,
        include: {
          karyawan_pengajuan: {
            select: {
              nik: true,
              namaKaryawan: true,
              kantor: {
                select: {
                  id_kantor: true,
                  jenis_kantor: true,
                },
              },
              nik_SPV: true,
              nik_kabag: true,
              nik_kacab: true,
              nik_direkturBisnis: true,
              nik_direkturUtama: true,
            },
          },
        },
      });
  
      console.log("Fetched kredit data from DB:", data);
  
      const groupedData = data.reduce((acc, item) => {
        if (!item.karyawan_pengajuan) return acc;
  
        const nik = item.karyawan_pengajuan.nik;
        if (!acc[nik]) {
          acc[nik] = {
            namaKaryawan: item.karyawan_pengajuan.namaKaryawan,
            total_pengajuan: 0,
            total_disetujui: 0,
          };
        }
  
        acc[nik].total_pengajuan += item.nominal_pengajuan ?? 0;
        acc[nik].total_disetujui += item.nominal_disetujui ?? 0;
  
        return acc;
      }, {} as Record<string, { namaKaryawan: string; total_pengajuan: number; total_disetujui: number }>);
  
      console.log("Grouped kredit data:", Object.values(groupedData));
  
      return Object.values(groupedData);
    } catch (error) {
      console.error("Error fetching kredit data:", error);
      throw new Error("Gagal mengambil data kredit karyawan.");
    }
  }
  
  
  remove(id: number) {
    return `This action removes a #${id} kredit`;
  }
}
