import { IsString } from "class-validator";

export class CreateKecamatanDto {
    @IsString()
    id: string;

    @IsString()
    kabupatenKotaId: string;

    @IsString()
    nama: string;
}
