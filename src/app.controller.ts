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
import * as fs from 'fs';
import { MailerService } from './mailer/mailer.service';

@Controller()
export class AppController {
  constructor(private readonly mailerService: MailerService) {}
  @Get()
  getFruit(@Body() fruit) {
    return fruit;
  }

  @Post()
  createFruit(@Body() fruit: { name: string }) {
    return fruit;
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

  @Get('/send')
  send() {
    const html = fs.readFileSync(
      './src/mailer/templates/reset-password.html',
      'utf8',
    );

    return this.mailerService.send({
      to: 'lukasz.trzyna@gmail.com',
      from: 'ltrzyna@gmail.com',
      subject: 'Hello from NestJS',
      html,
    });
  }
}
