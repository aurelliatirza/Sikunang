import { PartialType } from '@nestjs/mapped-types';
import { CreateLaporanKunjunganDto } from './create-laporan-kunjungan.dto';

export class UpdateLaporanKunjunganDto extends PartialType(CreateLaporanKunjunganDto) {}
