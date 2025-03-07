import { PartialType } from '@nestjs/mapped-types';
import { CreateKreditDto } from './create-kredit.dto';

export class UpdateKreditDto extends PartialType(CreateKreditDto) {}
