import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class SendEmailDto {
  @ApiProperty({
    description:
      '수신자가 확인할 송신자의 이름과 메일 주소를 "이름 메일주소"꼴으로 입력한다. (호스트에 따라 지원하지 않을 수 있음)',
    example: '김경빈 kgb@gmail.com',
  })
  @IsNotEmpty()
  @Matches(/^[a-zA-Z가-힣]+ [a-zA-Z0-9]+@[a-z]+\.[a-z]+$/)
  from: string;

  @ApiProperty({
    description: '메일 수신자 주소 입력',
    example: 'iljo@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  to: string;

  @ApiProperty({
    description: '메일 제목',
    example: '안녕하세요, 일조유통입니다.',
    required: true,
  })
  @IsNotEmpty()
  @Length(1, 20)
  @IsString()
  title: string;

  @ApiProperty({
    description: '고객의 이름',
    example: '호철웍',
  })
  @Length(1, 10000)
  @IsNotEmpty()
  customerName: string;
}
