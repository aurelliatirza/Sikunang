import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateKreditDto } from './dto/create-kredit.dto';
import { UpdateKreditDto } from './dto/update-kredit.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Kredit } from '@prisma/client';
import { UpdateSlikCheckDto } from './dto/updateSlik.dto';
import { UpdateAnalisisSlik } from './dto/updateAnalisisSlik.dto';
import { UpdateVisitDto } from './dto/updateVisit.dto';
import { UpdateProposalDto } from './dto/updateProposal.dto';
import { UpdatedPersetujuansatu } from './dto/updatePersetujuanSatu.dto';
import { UpdatedPersetujuandua } from './dto/updatePersetujuanDua.dto';
import { UpdatedPersetujuantiga } from './dto/updatePersetujuanTiga.dto';

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
        status_pengajuan: { not: "dibatalkan" }, // Filter data yang tidak dibatalkan
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

  //Seleksi tabel persetujuan dua
  async getPersetujuanDua(): Promise<Kredit[]> {
    return this.prisma.kredit.findMany({
      where: {
        OR: [
          {
            AND: [
              { nominal_disetujui: { not: 0 } },
              { nominal_disetujui: { not: null } },
              { tenor_disetujui: { not: 0 } },
              { tenor_disetujui: { not: null } }
            ]
          },
          {
            status_persetujuansatu: { notIn: ["tolak", "belum_disetujui"] }
          }
        ]
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
  
  //Update Persetujuan Satu
  async updatePersetujuansatu(id: number, updatePersetujuansatu: UpdatedPersetujuansatu) {
    try {
        const kredit = await this.prisma.kredit.findUnique({
            where: { id_kredit: id },
        });

        if (!kredit) {
            throw new NotFoundException("Kredit tidak ditemukan");
        }

        const data: any = {
            status_persetujuansatu: updatePersetujuansatu.status_persetujuansatu || "belum_disetujui", // <-- Pastikan defaultnya "belum_disetujui"
            id_karyawan_persetujuansatu: updatePersetujuansatu.id_karyawan_persetujuansatu ?? kredit.id_karyawan_persetujuansatu,
            updatedAtPersetujuansatu: new Date(),
        };

        if (updatePersetujuansatu.status_persetujuansatu === "belum_disetujui") {
            data.tenor_disetujui = 0;
            data.nominal_disetujui = 0;
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

  remove(id: number) {
    return `This action removes a #${id} kredit`;
  }
}
