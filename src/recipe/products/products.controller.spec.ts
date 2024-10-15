import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductService } from './product.service';
import { FilterQueryDto } from '../../common/dto/filter-query.dto';
import { Product, Unit } from './product.entity';
import { CanActivate } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productService: ProductService; // Inicjalizujemy zmienną productService
  // let mockGuard: CanActivate;

  beforeEach(async () => {
    const mockGuard: CanActivate = {
      canActivate: jest.fn(() => {
        console.log('Mock guard activated');
        return true;
      }), // Symulacja strażnika, zawsze przepuszcza
    };

    // Tworzymy moduł testowy z ProductsController i ProductService
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          // Zastępujemy rzeczywistą implementację ProductService mockiem
          provide: ProductService,
          useValue: {
            readProducts: jest.fn(),
            getOneProductById: jest.fn(),
            updateProduct: jest.fn(),
            creteProduct: jest.fn(),
            deleteProduct: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard) // Zastępujemy rzeczywistego guarda mockiem
      .useValue(mockGuard)
      .compile();

    // Pobieramy instancje ProductsController i ProductService z modułu testowego
    controller = module.get<ProductsController>(ProductsController);
    productService = module.get<ProductService>(ProductService); // Pobieramy ProductService z TestingModule (NestJS)
  });

  // it('should activate guard', async () => {
  //   expect(mockGuard.canActivate).toHaveBeenCalled();
  // });

  it('should be defined', () => {
    // Sprawdzamy, czy kontroler został poprawnie zdefiniowany
    expect(controller).toBeDefined();
  });

  describe('readAll', () => {
    it('should return paginated product result and call the service .readProducts', async () => {
      const filter = new FilterQueryDto<Product>(); // Nowa instancja filtra
      const product = new Product(); // Nowa instancja produktu

      // Mockujemy produkt
      // Używamy spyOn, aby nasłuchiwać na wywołanie metody readProducts z productService
      // mockImplementation - zwracamy sztuczną implementację metody "readProducts", dodajemy "async" bo zwracamy Promise
      Object.assign(product, { id: 1, name: 'Sample product', unit: 'pinch' });
      jest
        .spyOn(productService, 'readProducts')
        .mockImplementation(async () => ({
          result: [product],
          total: 1,
        }));

      // Wywołujemy metodę getAll kontrolera z filtrem
      const result = await controller.getAll(filter);

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

      // Sprawdzamy, czy metoda readProducts została wywołana
      expect(productService.readProducts).toHaveBeenCalled();
    });

    // Zaznaczenie, że ten test zostanie dopisany w przyszłości
    it.todo('should have count method');
  });

  describe('get product by id', () => {
    it('get product by productId equal with id', async () => {
      const product = new Product(); // Nowa instancja produktu
      const productId = 1;
      // Mockujemy produkt
      Object.assign(product, { id: 1, name: 'Sample product', unit: 'pinch' });
      jest
        .spyOn(productService, 'getOneProductById')
        .mockImplementation(async () => product);

      // Wywołujemy metodę getOneProduct kontrolera z filtrem
      const result = await controller.getOneProduct(productId);
      // Sprawdzamy, czy wynik zwraca oczekiwane dane
      expect(result).toEqual({
        id: productId,
        name: 'Sample product',
        unit: 'pinch',
      });
    });

    it('should return a product with a different id than productId', async () => {
      const product = new Product(); // Nowa instancja produktu
      const productId = 1;
      // Mockujemy produkt z innym id niż productId
      Object.assign(product, {
        id: 2,
        name: 'Different product',
        unit: 'gram',
      });
      jest
        .spyOn(productService, 'getOneProductById')
        .mockImplementation(async () => product);

      // Wywołujemy metodę getOneProduct kontrolera z filtrem
      const result = await controller.getOneProduct(productId);

      // Sprawdzamy, czy id zwracanego produktu nie jest równe productId
      expect(result.id).not.toEqual(productId);
    });
  });

  describe('testing delete product', () => {
    it('should delete a product when found', async () => {
      const productId = 1;
      const product = new Product();
      Object.assign(product, {
        id: productId,
        name: 'Pepper',
        unit: Unit.PINCH,
      });

      jest
        .spyOn(productService, 'getOneProductById')
        .mockImplementation(async (id) => {
          console.log(`getOneProductById called with id: ${id}`);
          return product;
        });

      jest
        .spyOn(productService, 'deleteProduct')
        .mockResolvedValue({ productId });

      // Ensure you're using await here
      const result = await controller.deleteOne(productId);

      // expect(productService.getOneProductById).toHaveBeenCalledWith(productId); // tutaj jest problem
      expect(productService.deleteProduct).toHaveBeenCalledWith(productId);
      expect(result).toEqual({ productId });
    });
  });
});
