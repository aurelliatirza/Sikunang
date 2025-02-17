import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DesaKelurahanService } from './desa-kelurahan.service';
import { CreateDesaKelurahanDto } from './dto/create-desa-kelurahan.dto';
import { UpdateDesaKelurahanDto } from './dto/update-desa-kelurahan.dto';
import { Kecamatan } from 'src/kecamatan/entities/kecamatan.entity';

@Controller('desa-kelurahan')
export class DesaKelurahanController {
  constructor(private readonly desaKelurahanService: DesaKelurahanService) {}

  @Post()
  create(@Body() createDesaKelurahanDto: CreateDesaKelurahanDto) {
    return this.desaKelurahanService.create(createDesaKelurahanDto);
  }

  @Get()
  findAll() {
    return this.desaKelurahanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.desaKelurahanService.findOne(id);
  }

  @Get('filter/:kecamatanId')
  async getDesaKelurahanByKecamatan(@Param('kecamatanId') kecamatanId: string) {
    return this.desaKelurahanService.getDesaKelurahanByKecamatan(kecamatanId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDesaKelurahanDto: UpdateDesaKelurahanDto) {
    return this.desaKelurahanService.update(id, updateDesaKelurahanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.desaKelurahanService.remove(id);
  }
}
