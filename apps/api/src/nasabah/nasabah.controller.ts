import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NasabahService } from './nasabah.service';
import { CreateNasabahDto } from './dto/create-nasabah.dto';
import { UpdateNasabahDto } from './dto/update-nasabah.dto';

@Controller('nasabah')
export class NasabahController {
  constructor(private readonly nasabahService: NasabahService) {}

  @Post()
  create(@Body() createNasabahDto: CreateNasabahDto) {
    return this.nasabahService.create(createNasabahDto);
  }

  @Get()
  findAll() {
    return this.nasabahService.findAll();
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
