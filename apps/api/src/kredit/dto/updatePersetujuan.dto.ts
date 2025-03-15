import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatePersetujuan {
    //Tahap persetujuan 1
    @IsString()
    @IsOptional()
    status_persetujuansatu?: string;

    @IsNumber()
    @IsOptional()
    id_karyawan_persetujuansatu?: number;

    @IsOptional()
    updatedAtPersetujuansatu?: Date;

    //Tahap persetujuan 2
    @IsString()
    @IsOptional()
    status_persetujuandua?: string;

    @IsNumber()
    @IsOptional()
    id_karyawan_persetujuandua?: number;

    @IsOptional()
    updatedAtPersetujuandua?: Date;

    //Tahap persetujuan 3
    @IsString()
    @IsOptional()
    status_persetujuantiga?: string;

    @IsNumber()
    @IsOptional()
    id_karyawan_persetujuantiga?: number;

    @IsOptional()
    updatedAtPersetujuantiga?: Date;

    @IsOptional()
    @IsNumber()
    nominal_disetujui?: number;

    @IsOptional()
    @IsNumber()
    tenor_disetujui?: number;
}