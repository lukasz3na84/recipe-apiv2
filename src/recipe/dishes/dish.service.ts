import { Injectable, NotFoundException } from '@nestjs/common';
import { Dish } from './dish.entity';
import { UpdateDishDto } from './dto/update-dish-dto';
import { CreateDishDto } from './dto/create-dish-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish) private dishRepository: Repository<Dish>,
  ) {}

  create(dish: CreateDishDto): Promise<Dish> {
    // const newDish = new Dish();
    // Object.assign(newDish, dish);
    return this.dishRepository.save(dish);
  }

  getAllDishes(): Promise<Dish[]> {
    return this.dishRepository.find({ relations: ['products'] });
  }

  async getOneDishById(dishId): Promise<Dish> {
    const dish = await this.dishRepository.findOne({
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

  async update(dish: UpdateDishDto): Promise<UpdateResult> {
    await this.getOneDishById(dish.id);
    return this.dishRepository.update(dish.id, dish);
  }

  async delete(dishId: number): Promise<Dish> {
    const dishToRemove = await this.getOneDishById(dishId);
    return this.dishRepository.remove(dishToRemove);
  }
}
