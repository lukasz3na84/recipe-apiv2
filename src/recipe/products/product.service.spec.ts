import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product, Unit } from './product.entity';
import { FilterQueryDto } from '../../common/dto/filter-query.dto';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: Repository<Product>;
  const product = new Product();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn(), // Mockowanie metody create
            save: jest.fn(), // Mockowanie metody save,
            findAndCount: jest.fn(), // Mockowanie metody findAndCount,
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get(getRepositoryToken(Product));
  });

  it('creteProduct', async () => {
    // Mockujemy produkt
    Object.assign(product, { id: 1, name: 'Sample product', unit: 'pinch' });

    // Mockujemy zachowanie metod create i save
    jest.spyOn(productRepository, 'create').mockImplementation(() => product);
    jest.spyOn(productRepository, 'save').mockResolvedValue(product);

    const result = await productService.creteProduct(product);

    expect(result).toEqual(product);
    expect(productRepository.create).toHaveBeenCalledWith(product);
    expect(productRepository.save).toHaveBeenCalledWith(product);
  });

  it('readProducts', async () => {
    const filters = new FilterQueryDto('product', 1, 10, 'ASC');
    // Mockujemy produkt
    Object.assign(product, { id: 1, name: 'Sample product', unit: 'pinch' });
    // Mockujemy zachowanie metod findAndCount
    jest
      .spyOn(productRepository, 'findAndCount')
      .mockResolvedValue([[product], 1]);

    // Wywołujemy metodę getAll kontrolera z filtrem
    const result = await productService.readProducts(filters);
    // Sprawdzamy, czy wynik zwraca oczekiwane dane
    expect(result).toEqual({
      result: [
        {
          id: 1,
          name: 'Sample product',
          unit: 'pinch',
        },
      ],
      total: 1,
    });
  });

  it('readProducts - no results for filter', async () => {
    const filters = new FilterQueryDto('Sample product', 1, 10, 'DESC');

    // Mockujemy metodę findAndCount, aby zwracała pustą tablicę i total = 0
    jest.spyOn(productRepository, 'findAndCount').mockResolvedValue([[], 0]);

    // Wywołujemy metodę readProducts z filtrem, który nie powinien zwrócić żadnych wyników
    const result = await productService.readProducts(filters);

    // Sprawdzamy, czy wynik jest pusty i total = 0
    expect(result).toEqual({
      result: [], // Oczekujemy pustej tablicy
      total: 0, // Oczekujemy total = 0
    });
  });

  it('getOneProductById', async () => {
    const productId = 1;
    const mockProduct = new Product();

    Object.assign(mockProduct, {
      id: productId,
      name: 'Test Product',
      unit: 'kg',
    });

    // Mockujemy zachowanie metody findOne z klauzulą "where"
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct);

    // Wywołujemy metodę serwisu
    const result = await productService.getOneProductById(productId);

    // Sprawdzamy, czy metoda findOne została wywołana z odpowiednim argumentem "where"
    expect(productRepository.findOne).toHaveBeenCalledWith({
      where: { id: productId },
    });

    // Sprawdzamy, czy wynik jest taki, jak oczekiwaliśmy
    expect(result).toEqual(mockProduct);
  });

  it('getOneProductById - product not found', async () => {
    const productId = 999; // Przykładowe ID, które nie istnieje

    // Mockujemy zwrócenie null, gdy produkt nie istnieje
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);

    // Sprawdzamy, czy zostanie rzucony odpowiedni wyjątek
    await expect(productService.getOneProductById(productId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('update product', async () => {
    const productId = 1;
    const updateData = { id: productId, name: 'Updated product', unit: Unit.G }; // Nowe dane do zaktualizowania
    const product = new Product(); // Instancja produktu

    // Mockujemy produkt
    Object.assign(product, {
      id: productId,
      name: 'Sample product',
      unit: Unit.KG,
    });

    // Mockujemy getOneProductById, aby zwracał produkt
    jest.spyOn(productService, 'getOneProductById').mockResolvedValue(product);

    // Mockujemy metodę update
    const updateResult = { generatedMaps: [], raw: [], affected: 1 };
    jest.spyOn(productRepository, 'update').mockResolvedValue(updateResult);

    // Wywołujemy metodę serwisu
    const result = await productService.updateProduct(updateData);

    // Sprawdzamy, czy getOneProductById został wywołany z odpowiednim productId
    expect(productService.getOneProductById).toHaveBeenCalledWith(productId);

    // Sprawdzamy, czy update zwrócił oczekiwany wynik
    expect(result).toEqual(updateResult);

    // Sprawdzamy, czy metoda update została wywołana z odpowiednimi argumentami
    expect(productRepository.update).toHaveBeenCalledWith(
      productId,
      updateData,
    );
  });

  it('deleteProduct', async () => {
    const productId = 1;
    const product = new Product();
    // Mockujemy produkt
    Object.assign(product, {
      id: productId,
      name: 'Sample product',
      unit: Unit.KG,
    });

    // Mockujemy metody
    jest.spyOn(productService, 'getOneProductById').mockResolvedValue(product);
    jest.spyOn(productRepository, 'remove').mockResolvedValue(product);

    // Wywołujemy metodę serwisu
    const result = await productService.deleteProduct(productId);
    expect(productService.getOneProductById).toHaveBeenCalledWith(productId);
    expect(result).toEqual({ productId });
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });
});
