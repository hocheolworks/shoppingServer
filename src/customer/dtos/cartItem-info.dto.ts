import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import ProductInfoEntity from 'src/product/entities/product.entity';
import CustomerInfoEntity from '../entities/customer.entity';

export class SelectCartItemInfoDto {
  //   @ApiProperty({
  //     description: '주문 고객 id',
  //     example: 10,
  //     required: true,
  //   })
  //   @IsNotEmpty()
  //   @IsNumber()
  //   customerId: number;

  customer: CustomerInfoEntity;
  customerId: number;

  //   @ApiProperty({
  //     description: '상품 id',
  //     example: 2,
  //     required: true,
  //   })
  //   @IsNotEmpty()
  //   @IsNumber()
  //   productId: string;

  product: ProductInfoEntity;
  productId: number;

  @ApiProperty({
    description: '상품 개수',
    example: 10,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  productCount: number;

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

export class InputCartItemInfoDto {
  @ApiProperty({
    description: '상품 id',
    example: 2,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({
    description: '상품 개수',
    example: 10,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  productCount: number;

  productPrice: number;
}
