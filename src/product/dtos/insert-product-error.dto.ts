import { ApiProperty } from '@nestjs/swagger';

export class InsertProductError {
  @ApiProperty({
    description: '상품 이름 오류 메시지',
    example: '상품 이름은 필수 입력 값입니다.',
  })
  productNameError: string;

  @ApiProperty({
    description: '상품 최소 주문 수량 오류 메시지',
    example: '상품 최소 주문 수량은 필수 입력 값입니다.',
  })
  productMinimumEAError: string;

  @ApiProperty({
    description: '상품 가격 오류 메시지',
    example: '상품 가격은 필수 입력 값입니다.',
  })
  productPriceError: string;

  @ApiProperty({
    description: '상품 설명 오류 메시지',
    example: '상품 설명은 필수 입력 값입니다.',
  })
  productDescriptionError: string;
}
