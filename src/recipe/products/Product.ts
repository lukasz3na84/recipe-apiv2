import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Dish } from '../dishes/Dish';

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

  @Column({ type: 'decimal' })
  amount: number;

  @ManyToOne(() => Dish, (dish: Dish) => dish.products)
  dish: Dish;
}
