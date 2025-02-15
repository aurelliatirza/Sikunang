import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KabupatenKotaService } from './kabupaten-kota.service';
import { CreateKabupatenKotaDto } from './dto/create-kabupaten-kota.dto';
import { UpdateKabupatenKotaDto } from './dto/update-kabupaten-kota.dto';

@Controller('kabupaten-kota')
export class KabupatenKotaController {
  constructor(private readonly kabupatenKotaService: KabupatenKotaService) {}

  @Post()
  create(@Body() createKabupatenKotaDto: CreateKabupatenKotaDto) {
    return this.kabupatenKotaService.create(createKabupatenKotaDto);
  }

  @Get()
  findAll() {
    return this.kabupatenKotaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kabupatenKotaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKabupatenKotaDto: UpdateKabupatenKotaDto) {
    return this.kabupatenKotaService.update(+id, updateKabupatenKotaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kabupatenKotaService.remove(+id);
  }
}
