import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDishDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'Servings must be provided' })
  servings: number;
}
