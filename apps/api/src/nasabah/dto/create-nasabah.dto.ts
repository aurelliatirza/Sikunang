import { IsNotEmpty, IsNumber, IsString } from "class-validator"
export class CreateNasabahDto {
    @IsString()
    @IsNotEmpty()
    namaNasabah: string;

    @IsString()
    @IsNotEmpty()
    alamat: string;

    @IsString()
    @IsNotEmpty()
    no_telp: string;

    @IsString()
    @IsNotEmpty()
    namaUsaha: string;

    @IsNumber()
    @IsNotEmpty()
    nik: number;

    @IsString()
    @IsNotEmpty()
    desaKelurahanId: string;
}
