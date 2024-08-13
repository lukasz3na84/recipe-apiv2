import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../products/Product';

@Entity()
export class Dish extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'decimal', nullable: true })
  servings: number;

  @Column({ type: 'text' })
  description?: string;

  // One to Many
  @OneToMany(() => Product, (product: Product) => product.dish)
  products: Product[];
}
