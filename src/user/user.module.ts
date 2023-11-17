import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'src/jwt-config';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { PasswordService } from './services/password.service';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserMapper } from './mappers/user.mapper';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController, UserController],
  providers: [
    UserService,
    UserMapper,
    PasswordService,
    AuthService,
    JwtStrategy,
  ],
  exports: [JwtModule],
})
export class UserModule {}
