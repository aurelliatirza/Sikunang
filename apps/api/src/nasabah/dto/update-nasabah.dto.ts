import { IsOptional, IsString } from 'class-validator';

export class UpdateNasabahDto {
    @IsOptional()
    @IsString()
    namaNasabah?: string;

    @IsOptional()
    @IsString()
    alamat?: string;

    @IsOptional()
    @IsString()
    no_telp?: string;

    @IsOptional()
    @IsString()
    namaUsaha?: string;
}
