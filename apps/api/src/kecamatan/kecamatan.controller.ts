import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { KecamatanService } from './kecamatan.service';
import { CreateKecamatanDto } from './dto/create-kecamatan.dto';
import { UpdateKecamatanDto } from './dto/update-kecamatan.dto';

@Controller('kecamatan')
export class KecamatanController {
  constructor(private readonly kecamatanService: KecamatanService) {}

  @Post()
  create(@Body() createKecamatanDto: CreateKecamatanDto) {
    return this.kecamatanService.create(createKecamatanDto);
  }

  @Get()
  findAll() {
    return this.kecamatanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kecamatanService.findOne(id);
  }

  // Mengambil kecamatan berdasarkan kabupaten/kota
  @Get('filter/:kabupatenKotaId')
  async getKecamatanByKabupatenKota(@Param('kabupatenKotaId') kabupatenKotaId: string) {
    return this.kecamatanService.getKecamatanByKabupatenKota(kabupatenKotaId);
  }
  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKecamatanDto: UpdateKecamatanDto) {
    return this.kecamatanService.update(id, updateKecamatanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kecamatanService.remove(id);
  }
}
