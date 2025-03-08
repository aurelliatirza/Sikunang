import { IsInt, IsString, IsOptional } from 'class-validator';

export class UpdateAnalisisSlik {
  @IsString()
  status_analisisSlik: string; // "sedang_diperiksa", "disetujui", dll.

  @IsOptional()
  @IsInt()
  id_karyawan_analisisSlik: number;

  @IsOptional()
  updatedAtAnalisisSlik?: Date;
}
