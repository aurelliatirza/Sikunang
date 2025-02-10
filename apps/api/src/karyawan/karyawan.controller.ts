import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { KaryawanService } from './karyawan.service';
import { CreateKaryawanDto } from './dto/create-karyawan.dto';
import { UpdateKaryawanDto } from './dto/update-karyawan.dto';

@Controller('karyawan')
export class KaryawanController {
  constructor(private readonly karyawanService: KaryawanService) {}

  @Post()
  create(@Body() createKaryawanDto: CreateKaryawanDto) {
    return this.karyawanService.create(createKaryawanDto);
  }


  @Get()
  findAll() {
    return this.karyawanService.findAll();
  }
  
  @Get('search')
  async getKaryawan(@Query('nik') nik?: string) {
    console.log("NIK dari query:", nik); // Debugging
    if (nik) {
      const result = await this.karyawanService.findByNik(Number(nik));
      console.log("Data ditemukan:", result); // Debugging
      return result ? [result] : []; // Mengembalikan array kosong jika tidak ada data
    }
    return this.karyawanService.findAll();
  }
  


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.karyawanService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateKaryawanDto: UpdateKaryawanDto) {
    return this.karyawanService.update(+id, updateKaryawanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.karyawanService.remove(+id);
  }
}
