import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KreditService } from './kredit.service';
import { CreateKreditDto } from './dto/create-kredit.dto';
import { UpdateKreditDto } from './dto/update-kredit.dto';
import { create } from 'domain';
import { Kredit } from '@prisma/client';

@Controller('kredit')
export class KreditController {
  constructor(private readonly kreditService: KreditService) {}

  @Post()
  async createKredit(@Body() createKreditDto: CreateKreditDto) {
    console.log("Data yang diterima di BE:", createKreditDto)
    return this.kreditService.createKredit(createKreditDto);
  }

  @Get()
  async getAllKredit(): Promise<Kredit[]>{
    return this.kreditService.getAllKredit();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kreditService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKreditDto: UpdateKreditDto) {
    return this.kreditService.update(+id, updateKreditDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kreditService.remove(+id);
  }
}
