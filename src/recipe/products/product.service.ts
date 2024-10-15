import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product-dto';
import { UpdateProductDto } from './dto/update-product-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, UpdateResult } from 'typeorm';
import { FilterQueryDto } from 'src/common/dto/filter-query.dto';

@Injectable()
export class ProductService {
  // Dependency Injection
  // wstrzkujemy bo chcemy miec jedna instacje DishService, w celu wywołania metody getOneDishById podczas tworzenia poroduktu
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    // private dishService: DishService, - usuniete po wprowadzeniu Ingredients
  ) {}

  async creteProduct(product: CreateProductDto): Promise<Product> {
    // const newProduct = new Product();
    // Object.assign(newProduct, product);
    const newProduct = await this.productRepository.create(product);
    // newProduct.dish = await this.dishService.getOneDishById(product.dishId); - usuniete po wprowadzeniu Ingredients
    return await this.productRepository.save(newProduct);
  }

  async readProducts(
    filters: FilterQueryDto<Product>,
  ): Promise<{ result: Product[]; total: number }> {
    const [result, total] = await this.productRepository.findAndCount({
      take: filters.limit,
      skip: filters.offset,
      order: { [filters.orderBy]: filters.order },
      where: [
        {
          name: Like('%' + filters.query + '%'),
        },
      ],
    });
    return {
      result,
      total,
    };
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
    return await this.productRepository.update(product.id, product);
  }

  async deleteProduct(productId: number): Promise<{ productId: number }> {
    try {
      // Ensure getOneProductById is asynchronous
      const productToRemove = await this.getOneProductById(productId);

      // Log for debugging
      console.log('Product to remove:', productToRemove);

      // Handle potential errors in repository method
      await this.productRepository.remove(productToRemove).catch((error) => {
        console.error('Error removing product:', error);
        throw error; // Re-throw the error for testing purposes
      });

      return { productId };
    } catch (error) {
      // Handle general errors
      console.error('Error deleting product:', error);
      throw error; // Re-throw the error for testing purposes
    }
  }
}

// https://chatgpt.com/c/670cd57f-5164-8013-8f0f-85332bbf8ea0
