import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNumber, IsObject, IsString, IsUrl, ValidateNested } from 'class-validator';

export class ObjektType {
  @IsNumber()
  id: number;

  @IsString()
  classes: string;

  @IsString()
  collectionId: string;

  @IsString()
  collectionNo: string;

  @IsString()
  member: string;

  @IsString()
  season: string;

  @IsString()
  @IsUrl()
  thumbnailImage: string;
}

export class ObjektRequestType {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ObjektType)
  have: ObjektType[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ObjektType)
  want: ObjektType[];
}

export class ManyToManyRequestDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ObjektRequestType)
  objekts: ObjektRequestType;
}

export class ManyToManyResponseDto {
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