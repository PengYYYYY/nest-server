import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsNotEmpty } from 'class-validator';

export class CreateCaptchaDto {
  @ApiProperty()
  @IsNotEmpty()
  type: string;
}

export class LoginDto {
  @ApiProperty()
  @IsPhoneNumber('CN')
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  captcha: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}
