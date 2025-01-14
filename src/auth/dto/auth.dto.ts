import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// 공통 필드를 가지는 기본 클래스 생성
class BaseUserDto {
  @ApiProperty({
    description: '유저 아이디',
    example: 'string',
  })
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @ApiProperty({
    description: '유저 비밀번호',
    example: 'string',
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

// SignUpDto에서 이메일 관련 필드 추가
export class SignUpDto extends BaseUserDto {
  @ApiProperty({
    description: '회원가입 기입 유저 이름',
    example: 'string',
  })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({
    description: '일반 회원가입 시 입력 이메일',
    example: 'string',
  })
  @IsOptional()
  @IsString()
  readonly email: string;
}

// LoginDto는 BaseUserDto를 그대로 활용
export class LoginDto extends BaseUserDto {}

// Google 사용자 저장 Dto
export class GoogleSaveDto {
  @ApiProperty({
    description: '구글 유저 정보 저장 시 입력 아이디',
    example: 'string',
  })
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @ApiProperty({
    description: '구글 유저 정보 저장 시 입력 이메일',
    example: 'string',
  })
  @IsOptional()
  @IsString()
  readonly email: string;

  @ApiProperty({
    description: '구글 로그인 시 JWT토큰 발급에 필요한 인증 토큰',
    example: 'string',
  })
  @IsOptional()
  @IsString()
  readonly token: string;
}
