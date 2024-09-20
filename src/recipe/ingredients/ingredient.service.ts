import { Injectable, NotFoundException } from '@nestjs/common';
import { IngredientRepository } from './ingredient.repository';
import { Ingredient } from './ingidient.entity';
import { DishService } from '../dishes/dish.service';
import { ProductService } from '../products/product.service';
import { CreateIngredientDto } from './dto/create-ingredient-dto';

@Injectable()
export class IngredientsService {
  constructor(
    private readonly ingredientRepository: IngredientRepository,
    private readonly productService: ProductService,
    private readonly dishService: DishService,
  ) {}

  async findOne(userId: number, id: number): Promise<Ingredient> {
    const ingredient = await this.ingredientRepository.findOne({
      where: {
        id,
      },
      relations: ['dish', 'product'],
    });
    if (
      !ingredient ||
      (!ingredient.dish.isPublic && ingredient.dish.userId !== userId)
    ) {
      throw new NotFoundException(`Ingredient with id ${id} not found`);
    }
    return ingredient;
  }

  async create(
    userId: number,
    ingredient: CreateIngredientDto,
  ): Promise<Ingredient> {
    const dish = await this.dishService.getOneOf(userId, ingredient.dishId);
    const product = await this.productService.getOneProductById(
      ingredient.productId,
    );
    return this.ingredientRepository.save({ ...ingredient, dish, product });
  }
}
