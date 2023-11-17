import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { UserService } from './user.service';
import { UserCreateDto } from '../dto/user/user.create.dto';
import { UserSignInDto } from '../dto/user/user.sign-in.dto';
import { TokenDto } from '../dto/token/token.dto';
import * as CryptoJs from 'crypto-js';
import { ConfigService } from '@nestjs/config';
import { UserRequestData } from 'src/global/types';
import { TokenInfoDto } from '../dto/token/token-info.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {}

  public async login(dto: UserSignInDto) {
    const user = await this.validateUser(dto);
    const tokens = this.generateTokens(user);
    this.updateUserResfreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  public async register(dto: UserCreateDto) {
    const user = await this.userService.create(dto);
    const tokens = this.generateTokens(user);
    this.updateUserResfreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  public async refreshToken(token: string) {
    const decodedToken = this.jwtService.verify(token) as UserRequestData;
    const user = await this.userService.findOneById(decodedToken.id);

    if (!user) throw new UnauthorizedException('Invalid token');

    const tokens = this.generateTokens(user);
    this.updateUserResfreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  private generateTokens(user: TokenInfoDto): TokenDto {
    const accessToken = this.jwtService.sign({
      email: user.email,
      id: user.id,
      name: user.name,
    });
    const refreshToken = this.jwtService.sign(
      {
        email: user.email,
        id: user.id,
        name: user.name,
      },
      { expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }

  private async updateUserResfreshToken(
    userId: number,
    newRefreshToken: string,
  ) {
    const encryptedToken = CryptoJs.AES.encrypt(
      newRefreshToken,
      this.configService.get('PRIVATE_KEY'),
    ).toString();

    await this.userService.update(userId, { refresh_token: encryptedToken });
  }

  private async validateUser(dto: UserSignInDto) {
    const user = await this.userService.findOneByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Bad credentials');
    }

    if (
      this.passwordService.decrypt(user.password) === dto.password &&
      user.email === dto.email
    ) {
      return user;
    }

    throw new UnauthorizedException('Bad credentials');
  }
}
