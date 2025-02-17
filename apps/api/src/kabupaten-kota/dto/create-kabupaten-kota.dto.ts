import { IsString } from "class-validator";


export class CreateKabupatenKotaDto {
    @IsString()
    id: string;

    @IsString()
    provinsiId: string;

    @IsString()
    nama: string;
}
