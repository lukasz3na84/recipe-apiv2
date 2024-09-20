import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { TransformerPipe } from './common/pipes/transformer/transformer.pipe';
import { AppGuard } from './common/guards/app/app.guard';
import { Admin } from './common/decorators/admin.decorator';

@Controller()
export class AppController {
  constructor() {}
  @Get()
  getFruit(@Body() fruit) {
    return fruit;
  }

  @Post()
  createFruit(@Body() fruit: { name: string }) {
    return fruit.name;
  }

  @Put()
  updateFruit(): string {
    return 'Hello';
  }

  @Delete(':fruitId')
  deleteFruit(@Param('fruitId') fruitId: string) {
    return { fruitId };
  }

  @Get('/user')
  @UsePipes(TransformerPipe)
  @UseGuards(AppGuard)
  getHello(@Query('name') name: string) {
    return `Hello ${name}!`;
  }

  @Get('/sample')
  @Admin()
  @UseGuards(AppGuard)
  getSample(@Query('name') name: string) {
    return `Hello ${name}!`;
  }
}
