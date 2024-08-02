import { IsOptional, IsString, IsUUID } from 'class-validator';

export class SearchEquipInfoDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  equipmentId?: string;
}
