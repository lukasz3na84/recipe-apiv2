import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/auth/user/user.entity';
import { Ingredient } from '../ingredients/ingidient.entity';

@Entity()
export class Dish extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  slug: string;

  @Column({ type: 'decimal', nullable: true })
  servings: number;

  @Column({ type: 'text' })
  description?: string;

  @ManyToOne(() => User, (user: User) => user.dishes)
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => Ingredient, (ingredient: Ingredient) => ingredient.dish, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  ingredients: Ingredient[];

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;
}
