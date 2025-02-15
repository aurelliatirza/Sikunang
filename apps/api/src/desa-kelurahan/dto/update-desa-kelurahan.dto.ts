import { PartialType } from '@nestjs/mapped-types';
import { CreateDesaKelurahanDto } from './create-desa-kelurahan.dto';

export class UpdateDesaKelurahanDto extends PartialType(CreateDesaKelurahanDto) {}
