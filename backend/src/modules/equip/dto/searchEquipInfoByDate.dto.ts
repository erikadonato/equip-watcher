import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class SearchEquipInfoByDateDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  initialDate: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  finalDate: Date;
}
