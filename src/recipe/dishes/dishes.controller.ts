import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateDishDto } from './dto/update-dish-dto';
import { CreateDishDto } from './dto/create-dish-dto';
import { DishService } from './dish.service';
import { JwtAuthGuard } from 'src/auth/auth/jwt.guard';
import { FilterQueryDto } from 'src/common/dto/filter-query.dto';
import { Dish } from './dish.entity';
import { FilterBy } from 'src/common/decorators/filter-by.decorator';

@Controller('dishes')
@UseGuards(JwtAuthGuard)
export class DishesController {
  constructor(private dishService: DishService) {}

  @Post()
  createOne(@Req() req, @Body() dish: CreateDishDto) {
    return this.dishService.create(req.user.id, dish);
  }

  @Get(':id')
  getOneDish(@Req() req, @Param('id', ParseIntPipe) dishId: number) {
    return this.dishService.getOneDishById(req.user.id, dishId);
  }

  @Get()
  async getAll(@Req() req, @FilterBy<Dish>() filters: FilterQueryDto<Dish>) {
    // limit, offset, orderBy, order(asc, desc), query
    return await this.dishService.getAllDishes(req.user.id, filters);
  }

  // @Put()
  // updateOne(@Req() req, @Body() dish: UpdateDishDto) {
  //   return this.dishService.update(req.user.id, dish.id, dish);
  // }

  @Patch(':id')
  updateByParam(
    @Req() req,
    @Param('id', ParseIntPipe) dishId: number,
    @Body() body: Partial<UpdateDishDto>,
  ) {
    return this.dishService.update(req.user.id, dishId, body);
  }

  @Delete(':id')
  async deleteOne(@Req() req, @Param('id', ParseIntPipe) dishId: number) {
    return await this.dishService.delete(req.user.id, dishId);
  }
}
