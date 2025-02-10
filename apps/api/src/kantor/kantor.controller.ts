import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KantorService } from './kantor.service';
import { CreateKantorDto } from './dto/create-kantor.dto';
import { UpdateKantorDto } from './dto/update-kantor.dto';

@Controller('kantor')
export class KantorController {
  constructor(private readonly kantorService: KantorService) {}

  @Post()
  create(@Body() createKantorDto: CreateKantorDto) {
    return this.kantorService.create(createKantorDto);
  }

  @Get()
  findAll() {
    return this.kantorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kantorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKantorDto: UpdateKantorDto) {
    return this.kantorService.update(+id, updateKantorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kantorService.remove(+id);
  }
}
