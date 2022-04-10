/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateCustomerInfoDto {
  @ApiProperty({
    description: '유저의 이메일',
    example: 'hocheolworks@hyeongwookbabo.com',
    required: true,
  })
  @IsNotEmpty({ message: '이메일을 올바른 형식으로 입력해주세요' })
  @Length(10, 100, { message: '이메일을 올바른 형식으로 입력해주세요' })
  @IsEmail({ message: '이메일을 올바른 형식으로 입력해주세요' })
  customerEmail: string;

  @ApiProperty({
    description: '고객명',
    example: '호철웍',
    required: true,
  })
  @Length(2, 20)
  @IsNotEmpty({ message: '이름을 확인해주세요' })
  @Matches(/^[가-힣]+$/, { message: '이름을 올바르게 입력해주세요' })
  customerName: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'abcd1234',
    required: true,
  })
  @IsNotEmpty({ message: '비밀번호를 확인해주세요' })
  @IsString({ message: '비밀번호를 확인해주세요' })
  @Length(5, 30, { message: '비밀번호를 5자 이상, 30자 미만으로 입력해주세요' })
  customerPassword: string;

  @ApiProperty({
    description: '확인용 비밀번호',
    example: 'abcd1234',
    required: true,
  })
  @IsNotEmpty({ message: '비밀번호를 확인해주세요' })
  @IsString({ message: '비밀번호를 확인해주세요' })
  @Length(5, 30, { message: '비밀번호를 5자 이상, 30자 미만으로 입력해주세요' })
  customerPassword2: string;

  @ApiProperty({
    description: '고객 전화번호',
    example: '010-2041-7503',
    required: true,
  })
  @IsNotEmpty({ message: '휴대폰 번호를 입력해주세요.' })
  @IsString({ message: '휴대폰 번호를 올바른 형식으로 입력해주세요.' })
  @Length(10, 30, { message: '휴대폰 번호를 올바른 형식으로 입력해주세요.' })
  customerPhoneNumber: string;

  verifyNumber: number;
}
