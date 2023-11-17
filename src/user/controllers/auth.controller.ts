import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { TokenInfoDto } from '../dto/token/token-info.dto';
import { UserCreateDto } from '../dto/user/user.create.dto';
import { UserSignInDto } from '../dto/user/user.sign-in.dto';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { ExtractUser } from '../decorators/user.decoratr';
import { RefreshTokenDto } from '../dto/token/refresh-token.dto';

@Controller('auth')
@ApiTags('User authentification')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * User login
   */
  @Post('/login')
  @UsePipes(new ValidationPipe())
  public async login(@Body() dto: UserSignInDto) {
    return await this.authService.login(dto);
  }

  /**
   * User registration
   */
  @Post('/registration')
  @UsePipes(new ValidationPipe())
  public async registration(@Body() dto: UserCreateDto) {
    return await this.authService.register(dto);
  }

  /**
   * Current user
   */
  @Post('/profile')
  @UseGuards(JwtAuthGuard)
  public whois(@ExtractUser() user: TokenInfoDto) {
    return user;
  }

  /**
   * Refresh token
   */
  @Post('/refresh')
  @UsePipes(new ValidationPipe())
  public async refreshToken(@Body() refresh: RefreshTokenDto) {
    return await this.authService.refreshToken(refresh.refreshToken);
  }
}
