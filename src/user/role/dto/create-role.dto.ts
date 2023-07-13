import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  menuList: string;

  @ApiProperty()
  @IsNotEmpty()
  operationList: string;

  @ApiProperty()
  mark: string;
}
