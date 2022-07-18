import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class EstimateResponseDto {
  @ApiProperty({
    description: '[FK] estimate_response의 id',
    example: 1,
    required: true,
  })
  estimateSheetId: number;

  @ApiProperty({
    description: '상품 총 가격',
    example: 10000,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  totalProductsPrice: number;

  @ApiProperty({
    description: '부가세',
    example: 1000,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  tax: number;

  @ApiProperty({
    description: '인쇄비',
    example: 1000,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  printFee: number;

  @ApiProperty({
    description: '배송비',
    example: 5000,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  deliveryFee: number;

  @ApiProperty({
    description: '총 견적',
    example: 17000,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @ApiProperty({
    description: '판매자의 말',
    example: '극진히 모시겠습니다.',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  memo: string;
}
