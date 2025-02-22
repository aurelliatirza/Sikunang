import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NasabahService } from './nasabah.service';
import { CreateNasabahDto } from './dto/create-nasabah.dto';
import { UpdateNasabahDto } from './dto/update-nasabah.dto';

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
  
  


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nasabahService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNasabahDto: UpdateNasabahDto) {
    return this.nasabahService.update(+id, updateNasabahDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nasabahService.remove(+id);
  }
}
