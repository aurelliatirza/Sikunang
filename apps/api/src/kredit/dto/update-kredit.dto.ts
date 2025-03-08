import { IsOptional, IsInt, IsString, IsNumber } from 'class-validator';

export class UpdateKreditDto {
  //Langkah Pertama
  @IsOptional()
  @IsNumber()
  nominal_pengajuan: number;

  @IsOptional()
  @IsNumber()
  tenor_pengajuan: number;

  @IsOptional()
  @IsString()
  status_pengajuan: string; //sedang_diajukan, batal
}
