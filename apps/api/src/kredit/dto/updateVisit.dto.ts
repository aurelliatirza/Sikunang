import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateVisitDto {
    @IsString()
    status_visitNasabah: string;

    @IsOptional()
    @IsNumber()
    id_karyawan_visitNasabah: number;

    @IsOptional()
    updatedAtVisitNasabah?: Date
}