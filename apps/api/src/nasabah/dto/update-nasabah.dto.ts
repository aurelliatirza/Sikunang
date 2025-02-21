import { PartialType } from '@nestjs/mapped-types';
import { CreateNasabahDto } from './create-nasabah.dto';

export class UpdateNasabahDto extends PartialType(CreateNasabahDto) {
    namaNasabah?: string;
    alamat?: string;
    no_telp?: string;
    namaUsaha?: string;
}
