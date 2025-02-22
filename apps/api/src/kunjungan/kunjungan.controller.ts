import { 
  Controller, Get, Post, Body, Param, Delete, 
  UploadedFile, UseInterceptors, UsePipes, ValidationPipe, 
  BadRequestException, 
  InternalServerErrorException
} from '@nestjs/common';
import { KunjunganService } from './kunjungan.service';
import { CreateKunjunganDto } from './dto/create-kunjungan.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { CreateNasabahDto } from 'src/nasabah/dto/create-nasabah.dto';
import { Kunjungan } from '@prisma/client';

@Controller('kunjungan')
export class KunjunganController {
  constructor(private readonly laporanKunjunganService: KunjunganService) {}

  @Post("upload")
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
    })
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan!');
    }
    return { filePath: `/uploads/${file.filename}` }; // Path saja yang disimpan
  } 
  
  @Post()
  async createKunjungan(@Body() kunjunganDto: CreateKunjunganDto) {
    console.log("Data yang diterima di backend:", kunjunganDto);
    return this.laporanKunjunganService.createKunjungan(kunjunganDto);
  }
  
  @Get()
  async getAllKunjungan(): Promise<Kunjungan[]> {
    return this.laporanKunjunganService.getAllKunjungan();
  }

  @Get(':id_kunjungan')
  findOne(@Param('id_kunjungan') id_kunjungan: string) {
      return this.laporanKunjunganService.findOne(Number(id_kunjungan));
  }

  @Delete(':id_kunjungan')
  remove(@Param('id_kunjungan') id_kunjungan: string) {
      return this.laporanKunjunganService.remove(Number(id_kunjungan));
  }
}
