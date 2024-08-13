import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Dish } from './Dish';
import { UpdateDishDto } from './dto/update-dish-dto';
import { CreateDishDto } from './dto/create-dish-dto';
import { ProductService } from 'src/recipe/products/product.service';

@Injectable()
export class DishService {
  constructor(private productService: ProductService) {}

  create(dish: CreateDishDto): Promise<Dish> {
    const newDish = new Dish();
    Object.assign(newDish, dish);
    return newDish.save();
  }

  getAllDishes(): Promise<Dish[]> {
    return Dish.find({ relations: ['products'] });
  }

  async getOneDishById(dishId): Promise<Dish> {
    const dish = await Dish.findOne({
      where: {
        id: dishId,
      },
      relations: ['products'],
    });
    if (!dish) {
      throw new NotFoundException('Dish not found');
    }
    return dish;
  }

  async update(dish: UpdateDishDto): Promise<Dish | HttpException> {
    const dishToUpdate = await this.getOneDishById(dish.id);
    Object.assign(dishToUpdate, dish);
    return dishToUpdate.save();
  }

  async delete(dishId: number): Promise<Dish> {
    const dishToRemove = await this.getOneDishById(dishId);
    return dishToRemove.remove();
  }
}
