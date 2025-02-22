import { Injectable } from '@nestjs/common';
import { CreateDesaKelurahanDto } from './dto/create-desa-kelurahan.dto';
import { UpdateDesaKelurahanDto } from './dto/update-desa-kelurahan.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DesaKelurahanService {
  constructor (private readonly prisma: PrismaService) {}

  create(createDesaKelurahanDto: CreateDesaKelurahanDto) {
    return this.prisma.desaKelurahan.create({
      data: createDesaKelurahanDto
    });
  }

  findAll() {
    return this.prisma.desaKelurahan.findMany();
  }

  // Menampilkan kecamatan dari kota/kabupaten terkait
  async getDesaKelurahanByKecamatan(kecamatanId: string) {
    return this.prisma.desaKelurahan.findMany({
      where:{kecamatanId,},
    })
  }

  // Menampilkan detail desa/kelurahan
  async getDesaKelurahanDetail(id: string) {
    return this.prisma.desaKelurahan.findUnique({
      where: { id },
      include: {
        Kecamatan: { 
          select: {
            id: true,
            nama: true,
            KabupatenKota: { 
              select: {
                id: true,
                nama: true
              }
            }
          }
        }
      }
    });
  }

  findOne(id: string) {
    return this.prisma.desaKelurahan.findUnique({
      where: {id},
    });
  }

  update(id: string, updateDesaKelurahanDto: UpdateDesaKelurahanDto) {
    return this.prisma.desaKelurahan.update({
      where: {id},
      data: updateDesaKelurahanDto,
    });
  }

  remove(id: string) {
    return this.prisma.desaKelurahan.delete({
      where: {id},
    });
  }
}
