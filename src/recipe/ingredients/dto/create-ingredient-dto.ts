import { IsNumber } from 'class-validator';

export class CreateIngredientDto {
  @IsNumber()
  dishId: number;

  @IsNumber()
  amount: number;

  @IsNumber()
  productId: number;
}
