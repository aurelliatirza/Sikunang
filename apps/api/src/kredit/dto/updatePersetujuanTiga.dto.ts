import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatedPersetujuantiga {
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