import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ingredient } from '../ingredients/ingidient.entity';

export enum Unit {
  KG = 'kg',
  G = 'g',
  TSP = 'tsp',
  SP = 'sp',
  PINCH = 'pinch',
  ML = 'ml',
  L = 'l',
  ITEM = 'item',
}

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'enum', enum: Unit })
  unit: Unit;

  @OneToMany(() => Ingredient, (ingredient: Ingredient) => ingredient.product, {
    onDelete: 'CASCADE',
  })
  ingredients: Ingredient[];
}
