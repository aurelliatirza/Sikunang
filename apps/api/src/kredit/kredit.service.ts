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

  //Fungsi yang menghitung nominal pengajuan dan nominal disetujui dari masing-masing karyawan
  async KreditKaryawan() {
    try {
      const data = await this.prisma.kredit.groupBy({
        by: ['id_karyawan_pengajuan'],
        _sum: {
          nominal_pengajuan: true,
          nominal_disetujui: true
        },
        orderBy: {
          _sum: { nominal_pengajuan: 'desc' } // Urutkan dari nominal pengajuan terbesar
        }
      });
  
      // Tambahkan informasi nama karyawan
      const result = await Promise.all(data.map(async (item) => {
        const karyawan = await this.prisma.karyawan.findUnique({
          where: { nik: item.id_karyawan_pengajuan },
          select: { namaKaryawan: true }
        });
  
        return {
          namaKaryawan: karyawan?.namaKaryawan || 'Unknown',
          total_pengajuan: item._sum.nominal_pengajuan || 0,
          total_disetujui: item._sum.nominal_disetujui || 0
        };
      }));
  
      return result;
    } catch (error) {
      console.error('Error fetching kredit data:', error);
      throw new Error('Gagal mengambil data kredit karyawan.');
    }
  }
  

  remove(id: number) {
    return `This action removes a #${id} kredit`;
  }
}
