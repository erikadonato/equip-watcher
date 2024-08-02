import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SaveEquipInfoDto {
  @IsString()
  @IsNotEmpty()
  equipmentId: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  timestamp: Date;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  value: number;
}
