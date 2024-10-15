import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { BaseEntity } from 'typeorm';

export class FilterQueryDto<ENTITY extends BaseEntity> {
  @IsNumber()
  @Min(1)
  @Max(180)
  @IsOptional()
  limit?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  offset?: number;

  @IsOptional()
  query?: string;

  @IsOptional()
  orderBy?: keyof ENTITY;

  @IsOptional()
  order?: 'ASC' | 'DESC';

  constructor(
    query?: string,
    offset?: string | number,
    limit?: string | number,
    order?: 'ASC' | 'DESC',
    orderBy?: keyof ENTITY,
  ) {
    this.query = query;
    this.offset = Number(offset);
    this.limit = Number(limit);
    this.order = order;
    this.orderBy = orderBy;
  }
}
