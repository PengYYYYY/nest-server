import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'phone' });
  }

  async validate(phone: string, pwd: string): Promise<any> {
    try {
      const { password, salt, ...user } = await this.authService.validateUser(
        phone,
        pwd,
      );
      return user;
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }
}
