import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, BadRequestException, ParseIntPipe, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { KreditService } from './kredit.service';
import { CreateKreditDto } from './dto/create-kredit.dto';
import { UpdateKreditDto } from './dto/update-kredit.dto';
import { UpdateSlikCheckDto } from './dto/updateSlik.dto';
import { Kredit } from '@prisma/client';
import { UpdateAnalisisSlik } from './dto/updateAnalisisSlik.dto';
import { UpdateVisitDto } from './dto/updateVisit.dto';
import { UpdateProposalDto } from './dto/updateProposal.dto';
import { UpdatePersetujuan } from './dto/updatePersetujuan.dto';

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

  @Get(':id_kredit')
  findOne(@Param('id_kredit') id_kredit: string) {
    console.log("ID dari parameter:", id_kredit); // Debugging parameter dari request
  
    const numericId = parseInt(id_kredit, 10);
  
    if (isNaN(numericId)) {
      throw new BadRequestException("ID harus berupa angka.");
    }
  
    console.log("ID setelah dikonversi:", numericId); // Debugging setelah parsing
  
    return this.kreditService.findOne(numericId);
  }
  
  
  @Get('filter/slikTable')
  async fetchSlikKredit(): Promise<Kredit[]> {
    try {
      return await this.kreditService.getSlikKredit();
    } catch (error) {
      console.error("Error fetching kredit data:", error); // Tambahkan log error
      throw new InternalServerErrorException("Terjadi kesalahan saat mengambil data kredit");
    }
  }

  @Get('filter/analisisSlikTable')
  async fetchAnalisisSlikKredit(): Promise<Kredit[]> {
    try {
      return await this.kreditService.getAnalisisSlikKredit();
    } catch (error) {
      console.error("Error fetching kredit data:", error); // Tambahkan log error
      throw new InternalServerErrorException("Terjadi kesalahan saat mengambil data kredit");
    }
  }

  @Get('filter/visitTable')
  async fetchVisitKredit(): Promise<Kredit[]> {
    try {
      return await this.kreditService.getVisit();
    } catch (error) {
      console.error("Error fetching kredit data:", error); // Tambahkan log error
      throw new InternalServerErrorException("Terjadi kesalahan saat mengambil data kredit");
    }
  }  

  @Get('filter/proposalTable')
  async fetchProposalKredit(): Promise<Kredit[]> {
    try {
      return await this.kreditService.getProposal();
    } catch (error) {
      console.error("Error fetching kredit data:", error); // Tambahkan log error
      throw new InternalServerErrorException("Terjadi kesalahan saat mengambil data kredit");
    }
  }

  @Get('filter/Persetujuan1Table')
  async fetchPersetujuanSatuKredit(): Promise<Kredit[]> {
    try {
      return await this.kreditService.getPersetujuanSatu();
    } catch (error) {
      console.error("Error fetching kredit data:", error); // Tambahkan log error
      throw new InternalServerErrorException("Terjadi kesalahan saat mengambil data kredit");
    }
  }

  @Get('filter/Persetujuan2Table')
  async fetchPersetujuanDuaKredit(): Promise<Kredit[]> {
    try {
      return await this.kreditService.getPersetujuanDua();
    } catch (error) {
      console.error("Error fetching kredit data:", error); // Tambahkan log error
      throw new InternalServerErrorException("Terjadi kesalahan saat mengambil data kredit");
    }
  }

  @Get('filter/Persetujuan3Table')
  async fetchPersetujuanTigaKredit(): Promise<Kredit[]> {
    try {
      return await this.kreditService.getPersetujuanTiga();
    } catch (error) {
      console.error("Error fetching kredit data:", error); // Tambahkan log error
      throw new InternalServerErrorException("Terjadi kesalahan saat mengambil data kredit");
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKreditDto: UpdateKreditDto) {
    return this.kreditService.update(Number(id), updateKreditDto);
  }
  
  @Patch(':id/slik-check')
  async updateSlikCheck(
    @Param('id') id: string,
    @Body() updateSlikCheckDto: UpdateSlikCheckDto
  ) {
    console.log("recieved ID:", id);
    console.log("recieved Data:", updateSlikCheckDto)
    return this.kreditService.updateSlikCheck(Number(id), updateSlikCheckDto);
  }

  @Patch(':id/analisisSlik')
  async updateAnalisisSlik(
    @Param('id') id: string,
    @Body() updateAnalisisSlik: UpdateAnalisisSlik
  ) {
    console.log("recieved ID:", id);
    console.log("recieved Data:", updateAnalisisSlik)
    return this.kreditService.updateAnalisisSlik(Number(id), updateAnalisisSlik);
  }

  @Patch(':id/visit')
  async updateVisit(
    @Param('id') id: string,
    @Body() updateVisit: UpdateVisitDto
  ) {
    console.log("recieved ID:", id);
    console.log("recieved Data:", updateVisit)
    return this.kreditService.updateVisit(Number(id), updateVisit);
  } 
  
  @Patch(':id/proposal')
  async updateProposal(
    @Param('id') id: string,
    @Body() updateProposal: UpdateProposalDto
  ) {
    console.log("recieved ID:", id);
    console.log("recieved Data:", updateProposal)
    return this.kreditService.updateProposal(Number(id), updateProposal);
  }

  @Patch(':id/persetujuan')
  async updatePersetujuan(
      @Param('id', ParseIntPipe) id: number,
      @Query('step') step: string,
      @Body() updatePersetujuanDto: UpdatePersetujuan
  ) {
      step = step.trim();  // Hapus spasi & newline
      console.log("📌 Step setelah trim:", step);
  
      return this.kreditService.updatePersetujuan(id, step as any, updatePersetujuanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kreditService.remove(+id);
  }
}
