import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class InputProductInfoDtd {
  @ApiProperty({
    description: '상품 최소 주문 수량',
    example: '10',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  productMinimumEA: number;

  @ApiProperty({
    description: '상품 최소 주문 수량',
    example: '10',
  })
  @IsNotEmpty()
  @IsNumber()
  productEA1: number;

  @ApiProperty({
    description: '상품 최소 주문 수량',
    example: '10',
  })
  @IsNotEmpty()
  @IsNumber()
  productEA2: number;

  @ApiProperty({
    description: '상품 최소 주문 수량',
    example: '10',
  })
  @IsNotEmpty()
  @IsNumber()
  productEA3: number;

  @ApiProperty({
    description: '상품 최소 주문 수량',
    example: '10',
  })
  @IsNotEmpty()
  @IsNumber()
  productEA4: number;

  @ApiProperty({
    description: '상품 최소 주문 수량',
    example: '10',
  })
  @IsNotEmpty()
  @IsNumber()
  productEA5: number;

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
    example: '3000',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  productPrice: number;

  @ApiProperty({
    description: '범위별 가격',
    example: '3000',
  })
  @IsNotEmpty()
  productPrice1: number | string;

  @ApiProperty({
    description: '범위별 가격',
    example: '3000',
  })
  @IsNotEmpty()
  productPrice2: number | string;

  @ApiProperty({
    description: '범위별 가격',
    example: '3000',
  })
  @IsNotEmpty()
  productPrice3: number | string;

  @ApiProperty({
    description: '범위별 가격',
    example: '3000',
  })
  @IsNotEmpty()
  productPrice4: number | string;

  @ApiProperty({
    description: '범위별 가격',
    example: '3000',
  })
  @IsNotEmpty()
  productPrice5: number | string;

  @ApiProperty({
    description: '상품 이미지 파일 경로',
    example: 'public/images/product/조끼.jpeg',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  productImageFilepath: string;
}
