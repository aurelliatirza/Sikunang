import { IsString, IsNumber } from "class-validator"; // Import dari class-validator

export class CreateUserDto {
    @IsString()
    username: string;

    @IsString() // Gunakan dekorator yang benar
    password: string;

    @IsNumber() // Gunakan dekorator IsNumber untuk validasi angka
    nik: number; // Gunakan tipe data TypeScript yang benar (number, bukan int)
}