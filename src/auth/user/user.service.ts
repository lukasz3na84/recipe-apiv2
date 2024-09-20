import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne(condition) {
    return this.userRepository.findOne({
      where: condition,
    });
  }

  async getOneById(id: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.dishes', 'dishes')
      .select(['user.id', 'user.email', 'dishes.name', 'dishes.id'])
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(user: Pick<CreateUserDto, 'email' | 'password'>): Promise<User> {
    return await this.userRepository.save({
      email: user.email.trim().toLowerCase(),
      password: await this.hashPassword(user.password),
    });
  }

  async update(id, props: Partial<UpdateUserDto>) {
    const user = await this.userRepository.preload({
      id,
      ...props,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not exist`);
    }

    return this.userRepository.save(user);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hashSync(password, 10);
  }

  async delete(id: number): Promise<{ success: boolean }> {
    const userToDelete = await this.userRepository.findOne({ where: { id } });
    if (!userToDelete) {
      throw new NotFoundException('User not found');
    }
    const { affected } = await this.userRepository.update(id, {
      email: v4(),
      password: v4(),
    });
    return affected ? { success: true } : { success: false };
  }
}
