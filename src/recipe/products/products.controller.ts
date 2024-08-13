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
import { CreateProductDto } from './dto/create-product-dto';
import { UpdateProductDto } from './dto/update-product-dto';
import { ProductService } from './product.service';
import { DishService } from 'src/recipe/dishes/dish.service';

@Controller('products')
export class ProductsController {
  //Dependency Injection
  constructor(
    private dishService: DishService,
    private productService: ProductService,
  ) {}

  @Post()
  createOne(@Body() product: CreateProductDto) {
    this.dishService.getOneDishById(product.dishId);
    return this.productService.creteProduct(product);
  }

  @Get()
  getAll() {
    return this.productService.readProducts();
  }

  @Get(':id')
  getOneProduct(@Param('id', ParseIntPipe) productId: number) {
    const product = this.productService.getOneProductById(productId);
    return product;
  }

  @Put()
  updateOne(@Body() product: UpdateProductDto) {
    this.productService.getOneProductById(product.id);
    this.productService.updateProduct(product);
    return product;
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) productId: number) {
    this.productService.getOneProductById(productId);
    return { productId };
  }
}
