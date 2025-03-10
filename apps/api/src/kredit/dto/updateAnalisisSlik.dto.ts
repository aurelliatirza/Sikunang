import { IsInt, IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateAnalisisSlik {
  @IsString()
  status_analisisSlik: string; // "sedang_diperiksa", "disetujui", dll.

  @IsOptional()
  @IsNumber()
  id_karyawan_analisisSlik: number;

  @IsOptional()
  updatedAtAnalisisSlik?: Date;
}
