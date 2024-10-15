import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product-dto';
import { UpdateProductDto } from './dto/update-product-dto';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../../auth/auth/jwt.guard';
import { FilterBy } from '../../common/decorators/filter-by.decorator';
import { Product } from './product.entity';
import { FilterQueryDto } from '../../common/dto/filter-query.dto';

@Controller('products')
export class ProductsController {
  //Dependency Injection
  constructor(private productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createOne(@Body() product: CreateProductDto) {
    return this.productService.creteProduct(product);
  }

  @Get()
  getAll(
    @FilterBy<Product>()
    filters: FilterQueryDto<Product>,
  ) {
    return this.productService.readProducts(filters);
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
  async deleteOne(@Param('id', ParseIntPipe) productId: number) {
    return await this.productService.deleteProduct(productId);
  }
}
