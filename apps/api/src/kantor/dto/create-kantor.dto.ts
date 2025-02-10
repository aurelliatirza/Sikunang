import { IsNumber, IsString } from "class-validator";

export class CreateKantorDto {
    @IsNumber()
    id_kantor: number;

    @IsString()
    jenis_kantor: string;
}
