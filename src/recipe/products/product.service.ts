import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Product } from './Product';
import { CreateProductDto } from './dto/create-product-dto';
import { UpdateProductDto } from './dto/update-product-dto';
import { DishService } from 'src/recipe/dishes/dish.service';

@Injectable()
export class ProductService {
  // Dependency Injection
  // wstrzkujemy bo chcemy miec jedna instacje DishService, w celu wywołania metody getOneDishById podczas tworzenia poroduktu
  constructor(
    @Inject(forwardRef(() => DishService)) private dishService: DishService,
  ) {}

  async creteProduct(product: CreateProductDto): Promise<Product> {
    const newProduct = new Product();
    Object.assign(newProduct, product);
    newProduct.dish = await this.dishService.getOneDishById(product.dishId);
    await newProduct.save();
    return newProduct;
  }

  readProducts(): Promise<Product[]> {
    return Product.find();
  }

  // getAllForDishId(dishId: number): Product[] {
  //   return this.products.filter((p: Product) => p.dishId === dishId);
  // }

  async getOneProductById(productId): Promise<Product> {
    const product = await Product.findOne({
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

  async updateProduct(product: UpdateProductDto): Promise<Product> {
    const productToUpdate = await this.getOneProductById(product.id);
    Object.assign(productToUpdate, product);
    return productToUpdate;
  }

  async deleteProduct(productId: number): Promise<Product> {
    const productToRemove = await this.getOneProductById(productId);
    return productToRemove.remove();
  }
}
