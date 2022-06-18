import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class TaxBillInfoDto {
  @ApiProperty({
    description: '세금 계산서 정보 번호',
    example: '1',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'order_info 테이블 참조값',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({
    description: '대표자 성명',
    example: '홍길동',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  representativeName: string;

  @ApiProperty({
    description: '사업자 등록 번호',
    example: '1231212345',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  companyRegistrationNumber: string;

  @ApiProperty({
    description: '사업장 소재지',
    example: '서울 중구 필동로1길 30',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  companyLocation: string;

  @ApiProperty({
    description: '사업장 소재지 상세주소',
    example: '동국대학교 남산학사 33623',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  companyLocationDetail: string;

  @ApiProperty({
    description: '업태',
    example: '도매업\n소매업',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  businessCategory: string;

  @ApiProperty({
    description: '종목',
    example: '잡화\n판촉물, 이벤트',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  businessType: string;

  @ApiProperty({
    description: '이메일(선택사항)',
    example: 'jinsoltrade@gmail.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: '생성날짜',
    example: '2022-03-29 11:49:02.286',
    required: true,
  })
  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: '수정날짜',
    example: '2022-03-29 11:49:02.286',
    required: true,
  })
  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    description: '삭제날짜',
    example: '2022-03-29 11:49:02.286',
    required: false,
  })
  @IsNotEmpty()
  @IsDate()
  deletedAt: Date;
}
