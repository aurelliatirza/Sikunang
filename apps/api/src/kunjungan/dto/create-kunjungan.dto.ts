import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateKunjunganDto {
  @IsNotEmpty({ message: "ID Nasabah wajib ada!" })
  @IsNumber({}, { message: "ID Nasabah harus berupa angka!" })
  id_nasabah: number;

  @IsNotEmpty({ message: "Hasil kunjungan tidak boleh kosong!" })
  @IsString()
  hasilKunjungan: string;

  @IsNotEmpty({ message: "Foto kunjungan tidak boleh kosong!" })
  @IsString()
  foto_kunjungan: string;
}
