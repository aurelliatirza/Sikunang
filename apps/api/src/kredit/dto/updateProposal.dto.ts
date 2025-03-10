import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProposalDto {
    @IsString()
    status_proposalKredit: string;

    @IsOptional()
    @IsNumber()
    id_karyawan_proposalKredit: number;

    @IsOptional()
    updatedAtProposalKredit: Date;
}