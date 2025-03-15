import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatedPersetujuandua {
    //Tahap persetujuan 2
    @IsString()
    @IsOptional()
    status_persetujuandua?: string;

    @IsNumber()
    @IsOptional()
    id_karyawan_persetujuandua?: number;

    @IsOptional()
    updatedAtPersetujuandua?: Date;


    @IsOptional()
    @IsNumber()
    nominal_disetujui?: number;

    @IsOptional()
    @IsNumber()
    tenor_disetujui?: number;
}