import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UpdateDishDto } from './dto/update-dish-dto';
import { CreateDishDto } from './dto/create-dish-dto';
import { DishService } from './dish.service';

@Controller('dishes')
export class DishesController {
  constructor(private dishService: DishService) {}

  @Post()
  createOne(@Body() dish: CreateDishDto) {
    return this.dishService.create(dish);
  }

  @Get(':id')
  getOneDish(@Param('id', ParseIntPipe) dishId: number) {
    return this.dishService.getOneDishById(dishId);
  }

  @Get()
  getAll() {
    return this.dishService.getAllDishes();
  }

  @Put()
  updateOne(@Body() dish: UpdateDishDto) {
    return this.dishService.update(dish);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) dishId: number) {
    return this.dishService.delete(dishId);
  }
}
