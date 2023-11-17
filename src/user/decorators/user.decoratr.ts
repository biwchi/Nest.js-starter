import { UnauthorizedException, createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
import { UserRequestData } from 'src/global/types';

config();

export const ExtractUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContextHost) => {
    const jwtService = new JwtService({
      secret: process.env.PRIVATE_KEY,
    });
    const req = ctx.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) return false;

    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];

    if (bearer === 'Bearer' && token) {
      try {
        const user = jwtService.verify(token) as UserRequestData;

        delete user.iat;
        delete user.exp;

        return user;
      } catch (error) {
        return undefined
      }
    }
  },
);
