import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//refresh-jwt to nazwa Strategii w passport
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-strategy') {}
