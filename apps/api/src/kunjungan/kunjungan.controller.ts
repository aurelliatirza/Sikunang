import { 
  Controller, Get, Post, Body, Param, Delete, 
  UploadedFile, UseInterceptors, UsePipes, ValidationPipe, 
  BadRequestException, 
  InternalServerErrorException,
  NotFoundException,
  Res,
  Put,
  Query,
  UseGuards,
  Req
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
import * as sharp from 'sharp';
import { Request } from 'express';
import { LocalAuthGuard } from 'src/auth/guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('kunjungan')
export class KunjunganController {
  constructor(private readonly laporanKunjunganService: KunjunganService) {}
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '/Users/tirzaaurellia/Documents/Foto Test Sikunang',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename = file.fieldname + '-' + uniqueSuffix + extname(file.originalname);
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan!');
    }

    const inputPath = file.path;
    const compressedFilename = `compressed-${file.filename}`;
    const outputPath = `/Users/tirzaaurellia/Documents/Foto Test Sikunang/${compressedFilename}`;

    try {
      // Ambil ukuran file sebelum dikompresi
      const originalSize = fs.statSync(inputPath).size;

      // Kompres gambar menggunakan Sharp
      await sharp(inputPath)
        .resize(800) // Resize lebar max 800px, tinggi menyesuaikan
        .jpeg({ quality: 75 }) // Simpan dalam format JPEG dengan kualitas 70%
        .toFile(outputPath);

      // Ambil ukuran file setelah dikompresi
      const compressedSize = fs.statSync(outputPath).size;

      // Hapus file asli setelah dikompresi (opsional)
      fs.unlinkSync(inputPath);

      console.log('📁 File asli:', file.filename, `(${(originalSize / 1024).toFixed(2)} KB)`);
      console.log('📁 File setelah dikompresi:', compressedFilename, `(${(compressedSize / 1024).toFixed(2)} KB)`);

      return { 
        originalSize: `${(originalSize / 1024).toFixed(2)} KB`,
        compressedSize: `${(compressedSize / 1024).toFixed(2)} KB`,
        filePath: compressedFilename
      };
    } catch (error) {
      console.error('❌ Error saat mengompresi gambar:', error);
      throw new BadRequestException('Gagal mengompresi gambar');
    }
          // // **Gunakan URL akses dari komputer lain**
      // return { filePath: `http://your-server-ip:8000/uploads/${file.filename}` };
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

  @Get('kunjunganBulanan')
  async KunjunganBulanan() {
    return this.laporanKunjunganService.totalKunjunganKaryawanBulanan();
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

  @UseGuards(JwtAuthGuard) // Pastikan user sudah login
  @Get("cetak")
  async cetakLaporan(
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const user = req.user as any; // Dapatkan user yang login dari request
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const laporan = await this.laporanKunjunganService.cetakLaporan(
      startDate,
      endDate,
      user.nik, // Ambil NIK karyawan yang sedang login
      user.nama, // Ambil nama karyawan yang sedang login
      user.karyawan.jabatan, // Ambil jabatan karyawan yang sedang login
    );

    res.download(laporan.filePath);
  }
  
}
