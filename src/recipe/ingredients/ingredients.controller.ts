import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IngredientsService } from './ingredient.service';
import { JwtAuthGuard } from 'src/auth/auth/jwt.guard';
import { CreateIngredientDto } from './dto/create-ingredient-dto';

@Controller('ingredients')
export class IngredientsController {
  constructor(private ingredientService: IngredientsService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return await this.ingredientService.findOne(req.user.id, id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createOne(@Req() req, @Body() ingredient: CreateIngredientDto) {
    return this.ingredientService.create(req.user.id, ingredient);
  }
}
