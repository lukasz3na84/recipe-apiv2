import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDishDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'Servings must be provided' })
  @IsOptional()
  servings: number;
}
