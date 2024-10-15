import { IsNumber, IsString } from 'class-validator';
import { Unit } from '../product.entity';

export class UpdateProductDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  unit: Unit;
}
