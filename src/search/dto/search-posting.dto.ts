import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { ObjektRequestType } from './search-objekt.dto';

export class SearchPostingRequestDto {
  @IsString()
  user: string | number;
}

export class SearchPostingResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsNumber()
  userId: number;

  @IsString()
  content: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ObjektRequestType)
  objekts: ObjektRequestType;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @IsString()
  username: string;
}