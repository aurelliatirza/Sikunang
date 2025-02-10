import { IsNumber, IsString, IsOptional } from "class-validator";

export class CreateKaryawanDto {
    @IsNumber()
    nik: number;

    @IsString()
    namaKaryawan: string;

    @IsString()
    jabatan: string;

    @IsOptional()
    @IsNumber()
    nik_SPV?: number;

    @IsOptional()
    @IsNumber()
    nik_kabag?: number;

    @IsOptional()
    @IsNumber()
    nik_direkturBisnis?: number;

    @IsNumber()
    id_kantor: number;
}