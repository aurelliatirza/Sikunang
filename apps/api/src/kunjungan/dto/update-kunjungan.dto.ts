import { PartialType } from '@nestjs/mapped-types';
import { CreateKunjunganDto } from './create-kunjungan.dto';

export class UpdateKunjunganDto extends PartialType(CreateKunjunganDto) {
    hasilKunjungan?: string;
    id_nasabah?: number;
    foto_kunjungan?: string; // Pastikan tipe data sesuai
}

