import { IsInt, IsString, IsOptional } from 'class-validator';

export class UpdateSlikCheckDto {
  @IsString()
  status_Slik: string; // "sedang_diperiksa", "disetujui", dll.

  @IsOptional()
  @IsInt()
  id_karyawan_slik: number;

  @IsOptional()
  updatedAtSlik?: Date;
}
