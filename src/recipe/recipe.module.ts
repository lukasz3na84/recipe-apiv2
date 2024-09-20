import { Module } from '@nestjs/common';
import { DishesController } from './dishes/dishes.controller';
import { ProductsController } from './products/products.controller';
import { DishService } from './dishes/dish.service';
import { ProductService } from './products/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
import { Dish } from './dishes/dish.entity';
import { IngredientsController } from './ingredients/ingredients.controller';
import { IngredientsService } from './ingredients/ingredient.service';
import { Ingredient } from './ingredients/ingidient.entity';
import { IngredientRepository } from './ingredients/ingredient.repository';
import { UserService } from 'src/auth/user/user.service';
import { User } from 'src/auth/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Dish, Ingredient, User])],
  controllers: [DishesController, ProductsController, IngredientsController],
  providers: [
    DishService,
    ProductService,
    IngredientsService,
    UserService,
    IngredientRepository,
  ],
  exports: [IngredientRepository, DishService, ProductService],
})
export class RecipeModule {}
