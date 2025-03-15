import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatedPersetujuansatu {
    //Tahap persetujuan 1
    @IsString()
    @IsOptional()
    status_persetujuansatu?: string;

    @IsNumber()
    @IsOptional()
    id_karyawan_persetujuansatu?: number;

    @IsOptional()
    updatedAtPersetujuansatu?: Date;


    @IsOptional()
    @IsNumber()
    nominal_disetujui?: number;

    @IsOptional()
    @IsNumber()
    tenor_disetujui?: number;
}