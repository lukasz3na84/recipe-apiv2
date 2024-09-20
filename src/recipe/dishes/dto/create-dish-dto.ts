import { IsString } from 'class-validator';
import { UpdateDishDto } from './update-dish-dto';

export class CreateDishDto extends UpdateDishDto {
  @IsString()
  name: string;
}

// chcemy aby name było wymahane, dlatego go napisujemy, bo w UpdateDishDto jest opcjonalne
