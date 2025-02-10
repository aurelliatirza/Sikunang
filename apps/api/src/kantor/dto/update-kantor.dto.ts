import { PartialType } from '@nestjs/mapped-types';
import { CreateKantorDto } from './create-kantor.dto';

export class UpdateKantorDto extends PartialType(CreateKantorDto) {}
