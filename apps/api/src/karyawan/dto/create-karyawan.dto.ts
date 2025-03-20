import { IsNumber, IsString, IsOptional } from "class-validator";

export class CreateKaryawanDto {
    @IsNumber()
    nik: number;

    @IsString()
    namaKaryawan: string;

    @IsString()
    jabatan: string;

    // Tambahkan field status
    @IsString()
    status: string; // Contoh: "AKTIF" atau "NON AKTIF"

    @IsOptional()
    @IsNumber()
    nik_SPV?: number;

    @IsOptional()
    @IsNumber()
    nik_kabag?: number;

    @IsOptional()
    @IsNumber()
    nik_direkturBisnis?: number;

    @IsOptional()
    @IsNumber()
    nik_kacab?: number;

    @IsNumber()
    id_kantor: number;
}