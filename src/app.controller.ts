import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

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
}
