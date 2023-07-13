import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
  Res,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SkipJwtAuth } from '@/common/decorator';

import { AuthService } from './auth.service';
import {
  CreateCaptchaDto,
  LoginDto,
  RefreshTokenDto,
} from './dto/create-auth.dto';

@ApiTags('auth')
@Controller('auth')
@SkipJwtAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req, @Body() body: LoginDto) {
    if (
      req.session['captcha-login']?.toLocaleLowerCase() !==
      body.captcha.toLocaleLowerCase()
    )
      throw new HttpException('验证码错误', HttpStatus.UNAUTHORIZED);

    return this.authService.generateTokens(req.user);
  }

  @Post('refresh-token')
  refreshToken(@Request() req, @Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('tokens-captcha')
  async createCaptcha(@Req() req, @Res() res, @Body() body: CreateCaptchaDto) {
    const { type } = body;
    const { text, data } = await this.authService.genCaptcha();

    req.session[`captcha-${type}`] = text;
    res.send(data);
  }
}
