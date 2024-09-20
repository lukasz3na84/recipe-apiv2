import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FilterQueryDto } from '../dto/filter-query.dto';
import { BaseEntity } from 'typeorm';

export const FilterBy = createParamDecorator(
  <ENTITY extends BaseEntity>(
    data: FilterQueryDto<ENTITY>,
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();
    const {
      query = data?.query ?? '',
      offset = data?.offset ?? 0,
      limit = data?.limit ?? 10,
      order = data?.order ?? 'DESC',
      orderBy = data?.orderBy ?? 'name',
    } = request.query;
    return new FilterQueryDto(query, offset, limit, order, orderBy);
  },
);
