import { Repository } from 'typeorm';
import { Ingredient } from './ingidient.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class IngredientRepository extends Repository<Ingredient> {
  constructor(
    @InjectRepository(Ingredient)
    private readonly repositoryIngredient: Repository<Ingredient>,
  ) {
    super(
      repositoryIngredient.target,
      repositoryIngredient.manager,
      repositoryIngredient.queryRunner,
    );
  }

  async findOneById(id: number): Promise<Ingredient | undefined> {
    return await this.createQueryBuilder('ingredient')
      .innerJoinAndSelect('ingredient.dish', 'dish')
      .innerJoinAndSelect('ingredient.product', 'product')
      .where('ingredient.id = :id', { id })
      .getOne();
  }
}
