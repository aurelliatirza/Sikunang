import { Injectable } from '@nestjs/common';
import { CreateKantorDto } from './dto/create-kantor.dto';
import { UpdateKantorDto } from './dto/update-kantor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class KantorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createKantorDto: CreateKantorDto) {
    return this.prisma.kantor.create({
      data: createKantorDto,
    });
  }

  async findAll() {
    return this.prisma.kantor.findMany();
  }

  async findOne(id: number) {
    return this.prisma.kantor.findUnique({
      where: { id_kantor: id },
    });
  }

  async update(id: number, updateKantorDto: UpdateKantorDto) {
    return this.prisma.kantor.update({
      where: { id_kantor: id },
      data: updateKantorDto,
    });
  }

  async remove(id: number) {
    return this.prisma.kantor.delete({
      where: { id_kantor: id },
    });
  }
}