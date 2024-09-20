import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    //query
    const query = request.query;
    //body
    const body = request.body;
    // console.log('request', request);
    // console.log('response', response);
    const metadata = this.reflector.get('roles', context.getHandler()); // wtedy możemy użyć w controlerze np:
    // @SetMetadata('roles', ['admin])
    console.log(metadata);
    return true;
  }
}
