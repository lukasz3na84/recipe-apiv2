import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/auth/user/user.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: (error?: Error | any) => void) {
    // const user = await this.userService.getOneById(1);
    // console.log(user);
    next();
  }
}
