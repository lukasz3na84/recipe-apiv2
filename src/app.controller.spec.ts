import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getHello', () => {
    let name: string;
    it('should return "Hello Łukasz!"', () => {
      name = 'Łukasz';
      expect(appController.getHello(name)).toBe('Hello Łukasz!');
    });
  });

  describe('createFruit', () => {
    it('should return proper fruit', () => {
      // Arrange
      const fruitDto = { name: 'Apple' };
      // Act
      const result = appController.createFruit(fruitDto);
      // Assert
      expect(result).toEqual(fruitDto);
    });
  });
});
