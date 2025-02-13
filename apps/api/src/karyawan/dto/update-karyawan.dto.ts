import { PartialType } from "@nestjs/mapped-types";
import { CreateKaryawanDto } from "./create-karyawan.dto";

export class UpdateKaryawanDto extends PartialType(CreateKaryawanDto) {
  namaKaryawan?: string;
  jabatan?: string;
  status?: string;
  id_kantor?: number;
  nik_SPV?: number | null;  // Pastikan bisa null
  nik_kabag?: number | null;
  nik_direkturBisnis?: number | null;
}
