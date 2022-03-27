/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerInfoDto {
  @ApiProperty({
    description: '유저의 이메일',
    example: 'hocheolworks@hyeongwookbabo.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;

  @ApiProperty({
    description: '고객명',
    example: '호철웍',
    required: true,
  })
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'abcd1234',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  customerPassword: string;

  @ApiProperty({
    description: '확인용 비밀번호',
    example: 'abcd1234',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  customerPassword2: string;

  @ApiProperty({
    description: '고객 전화번호',
    example: '010-2041-7503',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  customerPhoneNumber: string;
}
