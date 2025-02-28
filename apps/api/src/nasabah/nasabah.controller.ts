import { Controller, Get, Post, Body, Put, Param, Delete, Query, NotFoundException, Res } from '@nestjs/common';
import { NasabahService } from './nasabah.service';
import { CreateNasabahDto } from './dto/create-nasabah.dto';
import { UpdateNasabahDto } from './dto/update-nasabah.dto';
import * as fs from 'fs';
import { Response } from 'express';

@Controller('nasabah')
export class NasabahController {
  constructor(private readonly nasabahService: NasabahService) {}

  @Post()
  create(@Body() createNasabahDto: CreateNasabahDto) {
    return this.nasabahService.createNasabah(createNasabahDto);
  }

  @Get()
  findAll() {
    return this.nasabahService.findAll();
  }

  @Get('find-by-data')
  async findByData(
    @Query('nama') nama: string,
    @Query('no_telp') no_telp: string,
    @Query('alamat') alamat: string
  ) {
    return this.nasabahService.findNasabahByData(nama, no_telp, alamat);
  }

  @Get('kunjungan') // Ubah dari 'kunjunganNasabah' ke 'kunjungan'
  async kunjunganNasabah() {
    return this.nasabahService.KunjunganNasabah();
  }
  
  @Get(':id')
  async getNasabah(@Param('id') id: string) {
    console.log('Received ID:', id); // Debug log
    const numericId = Number(id);
    
    if (isNaN(numericId)) {
      throw new Error('ID harus berupa angka yang valid');
    }
    
    return this.nasabahService.findOne(numericId);
  }

  @Get('kunjungan/:id')
  async getKunjunganNasabah(@Param('id') id: string) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new Error('ID harus berupa angka yang valid');
    }
    return this.nasabahService.getKunjunganNasabah(numericId);
  }

  @Get('kunjungan/foto/:filename')
  async getFotoKunjungan(@Param('filename') filename: string, @Res() res: Response) {
      const filePath = await this.nasabahService.getFotoPath(filename);

      // Cek apakah file ada
      if (!fs.existsSync(filePath)) {
          throw new NotFoundException('File tidak ditemukan');
      }

      // Kirim file sebagai respon
      return res.sendFile(filePath);
  }


  @Put(':id')
  update(
      @Param('id') id: string, 
      @Body() updateNasabahDto: UpdateNasabahDto
  ) {
      console.log("Received ID:", id);
      console.log("Received Data:", updateNasabahDto);
      return this.nasabahService.update(Number(id), updateNasabahDto);
  }  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nasabahService.remove(+id);
  }
}
