import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryDto {
  @ApiProperty()
  @IsNotEmpty()
  pageSize: number;

  @ApiProperty()
  page: string;

  @ApiProperty()
  params: string;
}
