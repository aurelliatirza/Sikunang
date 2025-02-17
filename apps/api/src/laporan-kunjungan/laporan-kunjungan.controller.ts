import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LaporanKunjunganService } from './laporan-kunjungan.service';
import { CreateLaporanKunjunganDto } from './dto/create-laporan-kunjungan.dto';
import { UpdateLaporanKunjunganDto } from './dto/update-laporan-kunjungan.dto';

@Controller('laporan-kunjungan')
export class LaporanKunjunganController {
  constructor(private readonly laporanKunjunganService: LaporanKunjunganService) {}

  @Post()
  create(@Body() createLaporanKunjunganDto: CreateLaporanKunjunganDto) {
    return this.laporanKunjunganService.create(createLaporanKunjunganDto);
  }

  @Get()
  findAll() {
    return this.laporanKunjunganService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.laporanKunjunganService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLaporanKunjunganDto: UpdateLaporanKunjunganDto) {
    return this.laporanKunjunganService.update(+id, updateLaporanKunjunganDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.laporanKunjunganService.remove(+id);
  }
}
