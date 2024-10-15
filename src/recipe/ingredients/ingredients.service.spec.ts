import { Test, TestingModule } from '@nestjs/testing';
import { IngredientsService } from './ingredient.service';
import { ProductService } from '../products/product.service';
import { DishService } from '../dishes/dish.service';

describe('IngredientsService', () => {
  let service: IngredientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: IngredientsService, useValue: {} },
        { provide: ProductService, useValue: {} },
        { provide: DishService, useValue: {} },
      ],
    }).compile();

    service = module.get<IngredientsService>(IngredientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
