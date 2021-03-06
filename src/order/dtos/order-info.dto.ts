import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsPostalCode,
  isString,
  IsString,
} from 'class-validator';

class CartItemForInsertOrder {
  id?: number;
  customerId?: number;
  productId: number;
  productCount: number;
  isPrint: boolean;
}

export class SelectOrderInfoDto {
  @ApiProperty({
    description: '주문 번호',
    example: '1',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '배송지',
    example: '서울 중구 필동로1길 30',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  orderAddress: string;

  @ApiProperty({
    description: '상세 배송지',
    example: '동국대학교 남산학사 33623',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  orderAddressDetail: string;

  @ApiProperty({
    description: '주문자 명',
    example: '홍길동',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  orderCustomerName: string;

  @ApiProperty({
    description: '주문자 연락처',
    example: '01012341234',
    required: true,
  })
  @IsNotEmpty()
  @IsPhoneNumber('KR')
  orderPhoneNumber: string;

  @ApiProperty({
    description: '우편번호',
    example: '4620',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber() // @IsPostalCode에 KR은 없는듯...
  orderPostIndex: number;

  @ApiProperty({
    description: '총 주문 금액',
    example: '155000',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  orderTotalPrice: number;

  @ApiProperty({
    description: '총 주문 금액 중 총 상품 가격',
    example: '120000',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  orderTotalProductsPrice: number;

  @ApiProperty({
    description: '총 주문 금액 중 부가세',
    example: '1200',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  orderTax: number;

  @ApiProperty({
    description: '총 주문 금액 중 인쇄비',
    example: '5000',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  orderPrintFee: number;

  @ApiProperty({
    description: '총 주문 금액 중 배송비',
    example: '5000',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  orderDeliveryFee: number;

  @ApiProperty({
    description: '주문 상태',
    example: '결제대기',
    required: true,
    default: '결제대기',
  })
  @IsNotEmpty()
  @IsString()
  orderStatus: string;

  @ApiProperty({
    description: '결제 여부',
    example: true,
    required: true,
    default: false,
  })
  @IsNotEmpty()
  @IsString()
  orderIsPaid: boolean;

  @ApiProperty({
    description: '토스 결제 주문 ID',
    required: false,
    default: '',
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({
    description: '세금계산서 여부',
    example: true,
    required: true,
    default: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  isTaxBill: boolean;

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

export class InsertOrderInfoDto extends SelectOrderInfoDto {
  @ApiProperty({
    description: '아직 정하지 못했음', // TODO : 사용할지 말지 정해야함, 사용안하면 삭제할것
    example: [],
    required: false,
  })
  orderItems: Array<string>;

  @ApiProperty({
    description: '주문 상품 목록',
    example: { '1': 2, '5': 1 },
    required: true,
  })
  productsId: Map<string, number>;

  @ApiProperty({
    description: '고객 id',
    example: 1,
    required: true,
  })
  customerId: number;

  @ApiProperty({
    description: '주문 요청 사항',
    example: '문앞에 놔주세요',
    required: false,
  })
  @IsString()
  orderMemo: string | null;

  @ApiProperty({
    description: '디자인 파일 경로 리스트',
    example: '',
    required: false,
  })
  orderDesignFile: Array<string> | null;

  cart: Array<CartItemForInsertOrder>;
}
