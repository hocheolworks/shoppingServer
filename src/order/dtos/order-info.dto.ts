import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
} from 'class-validator';

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
    description: '배송 메오',
    example: '문앞에 놔주세요',
    required: false,
  })
  @IsString()
  orderMemo: string | null;
}
