import { PartialType } from '@nestjs/mapped-types';
import { CreateKabupatenKotaDto } from './create-kabupaten-kota.dto';

export class UpdateKabupatenKotaDto extends PartialType(CreateKabupatenKotaDto) {}
