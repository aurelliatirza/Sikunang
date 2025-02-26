import { 
  Controller, Get, Post, Body, Param, Delete, 
  UploadedFile, UseInterceptors, UsePipes, ValidationPipe, 
  BadRequestException, 
  InternalServerErrorException,
  NotFoundException,
  Res,
  Put
} from '@nestjs/common';
import { KunjunganService } from './kunjungan.service';
import { CreateKunjunganDto } from './dto/create-kunjungan.dto';
import { UpdateKunjunganDto } from './dto/update-kunjungan.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Kunjungan } from '@prisma/client';
import * as fs from 'fs';
import { Response } from 'express';

@Controller('kunjungan')
export class KunjunganController {
  constructor(private readonly laporanKunjunganService: KunjunganService) {}

  @Post("upload")
  @UseInterceptors(
      FileInterceptor('file', {
          storage: diskStorage({
              destination: '/Users/tirzaaurellia/Documents/Foto Test Sikunang',
              filename: (req, file, callback) => {
                  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                  const filename = file.fieldname + '-' + uniqueSuffix + extname(file.originalname);
                  console.log('📁 File diupload dengan nama:', filename);
                  callback(null, filename);
              },
          }),
      })
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
          throw new BadRequestException('File tidak ditemukan!');
      }
      console.log('🚦 Path file yang akan disimpan ke database:', file.filename);
      return { filePath: `${file.filename}` }; // Hanya simpan nama file, tanpa '/uploads/'
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

  @Get('foto/:filename')
  async getFotoKunjungan(@Param('filename') filename: string, @Res() res: Response) {
      const filePath = await this.laporanKunjunganService.getFotoPath(filename);

      // Cek apakah file ada
      if (!fs.existsSync(filePath)) {
          throw new NotFoundException('File tidak ditemukan');
      }

      // Kirim file sebagai respon
      return res.sendFile(filePath);
  }

  @Put(':id_kunjungan')
  update(
    @Param('id_kunjungan') id_kunjungan: string, 
    @Body() updateKunjunganDto: UpdateKunjunganDto
  ) {
    return this.laporanKunjunganService.updateKunjungan(Number(id_kunjungan), updateKunjunganDto);
  }  
  

  @Delete(':id_kunjungan')
  remove(@Param('id_kunjungan') id_kunjungan: string) {
      return this.laporanKunjunganService.remove(Number(id_kunjungan));
  }
}
