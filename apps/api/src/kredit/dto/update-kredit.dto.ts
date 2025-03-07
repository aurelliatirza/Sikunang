import { IsOptional, IsInt, IsString, IsNumber } from 'class-validator';

export class UpdateKreditDto {
  //Langkah kedua
  @IsOptional()
  @IsString()
  status_Slik?: string;
  @IsOptional()
  @IsNumber()
  id_karyawan_slik?: number;
  @IsOptional()
  updatedAtSlik?: Date;

  //Langkah ketiga
  @IsOptional()
  @IsString()
  status_analisisSlik?: string;
  @IsOptional()
  @IsNumber()
  id_karyawan_analisisSlik?: number ;
  @IsOptional()
  updatedAtAnalisisSlik: Date;

  //Langkah keempat
  @IsOptional()
  @IsString()
  status_visitNasabah?: string;
  @IsOptional()
  @IsNumber()
  id_karyawan_visitNasabah?: number ;
  @IsOptional()
  updatedAtVisitNasabah: Date;

  //Langkah kelima
  @IsOptional()
  @IsString()
  status_proposalKredit?: string;
  @IsOptional()
  @IsNumber()
  id_karyawan_proposalKredit?: number ;
  @IsOptional()
  updatedAtProposalKredit: Date;

  //Langkah keenam
  @IsOptional()
  @IsString()
  status_persetujuansatu?: string;
  @IsOptional()
  @IsNumber()
  id_karyawan_persetujuansatu?: number ;
  @IsOptional()
  updatedAtPersetujuansatu: Date;

  //Langkah ketuju
  @IsOptional()
  @IsString()
  status_persetujuandua?: string;
  @IsOptional()
  @IsNumber()
  id_karyawan_persetujuandua?: number ;
  @IsOptional()
  updatedAtPersetujuandua: Date;

  //Langkah kedelapan
  @IsOptional()
  @IsString()
  status_persetujuantiga?: string;
  @IsOptional()
  @IsNumber()
  id_karyawan_persetujuantiga?: number ;
  @IsOptional()
  updatedAtPersetujuantiga: Date;
}
