import { Test, TestingModule } from '@nestjs/testing';
import { DishService } from './dish.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Dish } from './dish.entity';
import { UserService } from '../../auth/user/user.service';
import { Repository } from 'typeorm';

describe('DishService', () => {
  let service: DishService;
  let dishRepository: Repository<Dish>; // dodanie repozytorium dish, a potem wyciągamy z modułu jej referencję

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DishService,
        {
          provide: getRepositoryToken(Dish),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue({
              where: () => ({
                getMany: () => [],
              }),
            }),
          },
        },
        { provide: UserService, useValue: {} },
      ],
    }).compile();

    service = module.get<DishService>(DishService);
    dishRepository = module.get(getRepositoryToken(Dish)); // wyciągnięcie refernecji do dishRipository
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('slugs', () => {
    it('should generate proper slug from given Dish name when no dish[] from findSlugs returned', async () => {
      const toSlug = 'french Fries with Vinegar';
      // jest.spyOn(service, 'findSlugs').mockReturnValue(Promise.resolve([])); - bo findSlugs jest metodą prywatną

      const sluggedResult = await service.generateSlug(toSlug);
      expect(sluggedResult).toBe('french-fries-with-vinegar');
    });

    it('should generate proper slug with order num from given name when some Dish[] from findSlugs returned', async () => {
      const toSlug = 'french Fries with Salt';

      // Mockowanie createQueryBuilder z odpowiednią strukturą
      jest.spyOn(dishRepository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getMany: jest
          .fn()
          .mockResolvedValue([new Dish(), new Dish(), new Dish()]), // Zwracamy 3 elementy
      } as any); // Używamy "as any", aby zignorować niezgodność typów SelectQueryBuilder

      const sluggedResult = await service.generateSlug(toSlug);
      expect(sluggedResult).toBe('french-fries-with-salt-3'); // Oczekujemy slug z "-3"
    });

    it('should generate proper slug with order num from given name when some Dish[] from findSlugs returned- wersja 2 z jest.mocked()', async () => {
      const toSlug = 'french Fries with Salt';

      // Użycie jest.mocked() dla dishRepository.createQueryBuilder
      const mockedQueryBuilder = jest.mocked(dishRepository.createQueryBuilder);

      // Mockowanie metod na query builderze
      mockedQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getMany: jest
          .fn()
          .mockResolvedValue([new Dish(), new Dish(), new Dish()]), // Zwracamy 3 elementy
      } as any); // Użycie "as any", aby zignorować niezgodność typów SelectQueryBuilder

      const sluggedResult = await service.generateSlug(toSlug);
      expect(sluggedResult).toBe('french-fries-with-salt-3'); // Oczekujemy slug z "-3"
    });
  });
});

// do sprawdzenia: it.each
