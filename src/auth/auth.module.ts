import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshJwtStrategy } from './auth/rjwt.strategy';
import { JwtStrategy } from './auth/jwt.strategy';
// import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_TOKEN'),
        signOptions: {
          expiresIn: `${configService.get<string>('JWT_EXPIRATION_SECRET')}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    JwtStrategy,
    RefreshJwtStrategy,
    AuthService,
    UserService,
    ConfigService,
  ],
  controllers: [AuthController],
  exports: [AuthService, UserService],
})
export class AuthModule {}
