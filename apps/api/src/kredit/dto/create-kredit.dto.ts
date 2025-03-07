import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreateKreditDto {
    @IsNotEmpty({ message: "Nasabah harus ada" })
    @IsNumber({}, { message: "ID Nasabah harus berupa angka" })
    id_nasabah: number;

    @IsNotEmpty({ message: "Nominal Pengajuan harus ada" })
    @IsNumber({}, { message: "Nominal harus berupa angka" })
    @Min(1, { message: "Nominal pengajuan harus lebih dari 0" })
    nominal_pengajuan: number;

    @IsNotEmpty({ message: "Tenor harus ada" })
    @IsNumber({}, { message: "Tenor harus berupa angka" })
    @Min(1, { message: "Tenor minimal 1 bulan" })
    tenor_pengajuan: number;

    @IsNotEmpty({ message: "ID Karyawan pengajuan harus ada" })
    @IsNumber({}, { message: "ID Karyawan harus berupa angka" })
    id_karyawan_pengajuan: number;
}
