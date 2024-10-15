import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Dish } from './dish.entity';
import { UpdateDishDto } from './dto/update-dish-dto';
import { CreateDishDto } from './dto/create-dish-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UserService } from '../../auth/user/user.service';
import slugify from 'slugify';
import { instanceToPlain } from 'class-transformer';
import { FilterQueryDto } from 'src/common/dto/filter-query.dto';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish) private dishRepository: Repository<Dish>,
    private readonly userService: UserService,
  ) {}

  async create(userId: number, dish: CreateDishDto): Promise<Dish> {
    // const newDish = new Dish();
    // Object.assign(newDish, dish);
    const user = await this.userService.getOneById(userId);
    const slug = await this.generateSlug(dish.name);
    return this.dishRepository.save({
      ...dish,
      user,
      slug,
    });
  }

  async getAllDishes(
    userId: number,
    filters: FilterQueryDto<Dish>,
  ): Promise<{ result: Dish[]; total: number }> {
    const [result, total] = await this.dishRepository.findAndCount({
      take: filters.limit,
      skip: filters.offset,
      order: {
        [filters.orderBy]: filters.order,
      }, // Upewnij się, że order jest poprawny
      where: [
        {
          name: Like('%' + filters.query + '%'),
          isPublic: true,
        },
        {
          name: Like('%' + filters.query + '%'),
          user: { id: userId },
        },
      ],
      join: {
        alias: 'dish',
        leftJoinAndSelect: {
          ingredients: 'dish.ingredients',
          product: 'ingredients.product',
        },
      },
    });

    return {
      result,
      total,
    };
  }

  async getOneDishById(userId: number, dishId: number): Promise<any> {
    const dish = await this.dishRepository.findOne({
      where: [
        { id: dishId, user: { id: userId } }, // Danie użytkownika o określonym ID
        { id: dishId, isPublic: true }, // Publiczne danie o określonym ID
      ],
      relations: ['user', 'ingredients', 'ingredients.product'],
    });

    if (!dish) {
      throw new NotFoundException('Dish not found');
    }

    // Zastosowanie instanceToPlain, aby zadziałało @Exclude()
    return instanceToPlain(dish);
  }

  async update(
    userId: number,
    dishId: number,
    dish: Partial<UpdateDishDto>,
  ): Promise<Dish> {
    const { id, userId: dishUserId } = await this.getOneDishById(
      userId,
      dishId,
    );

    if (!id) {
      throw new NotFoundException('Dish not found');
    }

    if (dishUserId !== userId) {
      throw new ForbiddenException('You are not allowed to update this dish');
    }

    await this.dishRepository.update(dishId, dish);
    return await this.getOneDishById(userId, dishId);
  }

  async findAndUpdate(
    userId: number,
    id: number,
    dish: Partial<UpdateDishDto>,
  ): Promise<Dish> {
    console.log(userId, id, dish);

    await this.getOneDishById(userId, id);
    await this.dishRepository.update(id, dish);
    return await this.getOneDishById(userId, id);
  }
  /*
  // wersja z remove

  async delete(res, userId: number, dishId: number): Promise<DeleteResult> {
    const dishToRemove = await this.getOneDishById(userId, dishId);
    if (dishToRemove.userId !== userId) {
      throw new ForbiddenException('You cannot delete this dish');
    }

    await this.dishRepository.remove(dishToRemove);
    return res.status(202).json({
      message: `Dish id: ${dishId} was deleted`,
    });
  }
*/

  async delete(userId: number, dishId: number): Promise<{ success: boolean }> {
    const dishToRemove = await this.getOneDishById(userId, dishId);
    if (dishToRemove.userId !== userId) {
      throw new ForbiddenException('You cannot delete this dish');
    }

    const { affected } = await this.dishRepository.delete(dishId);
    const result = affected ? { success: true } : { success: false };
    return result;
  }

  async generateSlug(name: string) {
    let slug = slugify(name, {
      replacement: '-',
      lower: true,
    });
    const slugExists = await this.findSlugs(slug);

    if (!slug || slugExists.length === 0) {
      return slug;
    }

    slug = slug + '-' + slugExists.length;
    return slug;
  }

  private async findSlugs(slug: string): Promise<Dish[]> {
    return await this.dishRepository
      .createQueryBuilder('dish')
      .where('slug LIKE :slug', { slug: `${slug}%` })
      .getMany();
  }

  async getOneOf(userId: number, dishId: number) {
    const dish = await this.dishRepository.findOne({
      where: {
        id: dishId,
        user: { id: userId }, // Referencja do relacji user i jego id
      },
    });

    if (!dish) {
      throw new NotFoundException('Dish not found');
    }
    return dish;
  }

  /*
  // użycie Query Buildera do aktualizacji
  async update2(userId: number, dishId: number, dish: Partial<UpdateDishDto>) {
    const { raw } = await this.dishRepository
      .createQueryBuilder()
      .update(Dish)
      .set(dish)
      .where('id = :id', { id: dishId })
      .andWhere('userId = :userId', { userId })
      .returning('*') // działa tylko dla Postgresowych baz
      .execute();

    if (!raw[0]) {
      throw new ForbiddenException('You are not allowed to update this dish');
    }
    return raw[0];
  }
    */
}
