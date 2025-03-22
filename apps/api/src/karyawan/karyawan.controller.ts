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

  @Get('profile')
  async getProfile() {
    return this.karyawanService.findProfile();
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

  @Get('/marketing')
  async getMarketingEmployees() {
    return this.karyawanService.getEmployeesByRole('marketing');
  }
  


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.karyawanService.findOne(+id);
  }

  @Put(':nik')
  async update(
    @Param('nik') nik: string,
    @Body() updateKaryawanDto: UpdateKaryawanDto,
  ) {
    console.log("Payload yang diterima:", updateKaryawanDto);
    const updated = await this.karyawanService.update(+nik, updateKaryawanDto);
    console.log("Data yang diupdate:", updated);
    return updated;
  }
  
  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.karyawanService.remove(+id);
  }
}
