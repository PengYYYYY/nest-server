import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as SvgCaptcha from 'svg-captcha';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { UserService } from '../user/user.service';
import { encryptPassword } from '../utils/cryptogram'; // 引入加密函数

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  generateTokens(payload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.userService.findById(id);
  }

  async refreshToken(token: string) {
    try {
      const { iat, exp, ...payload } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      return this.generateTokens(payload);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }

  async validateUser(phone: string, password: string) {
    const user = await this.userService.findByPhone(phone);
    if (!user) {
      throw '无此用户';
    }
    if (user.password === encryptPassword(password, user.salt)) {
      return user;
    } else {
      throw '密码错误';
    }
  }

  async validateUserById(id: number, password: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new HttpException('无此用户', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (user.password === encryptPassword(password, user.salt)) {
      return user;
    } else {
      throw new HttpException('密码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async genCaptcha() {
    const captchaData = SvgCaptcha.create({
      size: 4, // 验证码长度
      fontSize: 45, // 验证码字号
      noise: 1, // 干扰线条数目
      width: 120, // 宽度
      height: 40, // 高度
    });
    return captchaData;
  }
}
