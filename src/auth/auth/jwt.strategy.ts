import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-strategy') {
  constructor(
    private readonly authService: AuthService,
    protected readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.['access_token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_TOKEN'),
    });
  }

  async validate(payload: { user_id: number }) {
    const user = await this.authService.validateUser(payload.user_id);

    if (!user) {
      throw new UnauthorizedException('Unauthorized user');
    }
    return user;
  }
}
