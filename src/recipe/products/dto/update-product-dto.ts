import { IsNumber, IsString } from 'class-validator';
import { Unit } from '../Product';

export class UpdateProductDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  unit: Unit;

  @IsNumber()
  amount: number;

  @IsNumber()
  dishId: number;
}
