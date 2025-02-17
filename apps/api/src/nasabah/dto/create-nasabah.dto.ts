import { IsNumber, IsString } from "class-validator"
export class CreateNasabahDto {
    @IsNumber()
    id_nasabah: number;

    @IsString()
    namaNasabah: string;

    @IsString()
    alamat: string;

    @IsString()
    no_telp: string;

    @IsString()
    namaUsaha: string;

    @IsNumber()
    nik: number;
}
