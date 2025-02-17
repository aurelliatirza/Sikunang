import { IsString } from "class-validator"

export class CreateDesaKelurahanDto {
    @IsString()
    id: string;

    @IsString()
    kecamatanId: string;

    @IsString()
    nama: string;
}
