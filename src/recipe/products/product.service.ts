import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product-dto';
import { UpdateProductDto } from './dto/update-product-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { DishService } from '../dishes/dish.service';

@Injectable()
export class ProductService {
  // Dependency Injection
  // wstrzkujemy bo chcemy miec jedna instacje DishService, w celu wywołania metody getOneDishById podczas tworzenia poroduktu
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private dishService: DishService,
  ) {}

  async creteProduct(product: CreateProductDto): Promise<Product> {
    // const newProduct = new Product();
    // Object.assign(newProduct, product);
    const newProduct = await this.productRepository.create(product);
    newProduct.dish = await this.dishService.getOneDishById(product.dishId);
    return await this.productRepository.save(newProduct);
  }

  readProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  // getAllForDishId(dishId: number): Product[] {
  //   return this.products.filter((p: Product) => p.dishId === dishId);
  // }

  async getOneProductById(productId): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    } else {
      return product;
    }
  }

  async updateProduct(product: UpdateProductDto): Promise<UpdateResult> {
    await this.getOneProductById(product.id);
    // Object.assign(productToUpdate, product);
    return this.productRepository.update(product.id, product);
  }

  async deleteProduct(productId: number): Promise<Product> {
    const productToRemove = await this.getOneProductById(productId);
    return this.productRepository.remove(productToRemove);
  }
}
