import {
  Controller,
  Get,
  Post,
  HttpException,
  Body,
  Put,
  HttpStatus,
  Query,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipJwtAuth } from '@/common/decorator';

import { UserService } from './user.service';
import { CreateUserDto, CreateRootUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryDto } from '@/common/dto/query.dot';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @SkipJwtAuth()
  @Post('root')
  createRoot(@Request() req, @Body() data: CreateRootUserDto) {
    if (
      data.captcha &&
      req.session['captcha-install']?.toLocaleLowerCase() !==
        data.captcha.toLocaleLowerCase()
    )
      throw new HttpException('验证码错误', HttpStatus.SERVICE_UNAVAILABLE);
    return this.userService.createRoot({
      phone: data.phone,
      password: data.password,
    });
  }

  @Get()
  findAll(@Query() { pageSize, page, params }: QueryDto) {
    return this.userService.findAll(
      +pageSize,
      +page,
      JSON.parse(params || '{}'),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findById(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
