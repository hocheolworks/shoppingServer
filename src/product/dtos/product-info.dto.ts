import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class SelectProductInfoDto {
  @ApiProperty({
    description: '상품 번호',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '상품 최소 주문 수량',
    example: 10,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  productMinimumEA: number;

  @ApiProperty({
    description: '상품 명',
    example: '마트 장바구니',
    required: true,
  })
  @IsEmpty()
  @IsString()
  productName: string;

  @ApiProperty({
    description: '상품 설명',
    example: '얼마나 담을 수 있게요?',
    required: true,
  })
  @IsEmpty()
  @IsString()
  productDescription: string;

  @ApiProperty({
    description: '상품 가격',
    example: 3000,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  productPrice: number;

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
