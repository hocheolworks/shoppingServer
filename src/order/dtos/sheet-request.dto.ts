import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';
import { InputCartItemInfoDto } from 'src/customer/dtos/cartItem-info.dto';

export class SheetRequestDto {
  @ApiProperty({
    description: '대표자 이름',
    example: '이정철',
    required: true,
  })
  newCustomerName: string;

  @ApiProperty({
    description: '주문 고객 이메일',
    example: 'aa@naver.com',
    required: true,
  })
  newCustomerEmail: string;

  @ApiProperty({
    description: '연락처',
    example: '01012345678',
    required: true,
  })
  @IsPhoneNumber()
  newCustomerPhoneNumber: string;

  @ApiProperty({
    description: '업체 상호',
    example: '진솔유통',
    required: false,
  })
  businessName: string;

  @ApiProperty({
    description: '업태 및 종목',
    example: '이마트',
    required: false,
  })
  businessType: string;

  @ApiProperty({
    description: '사업자 등록 번호',
    example: '206-34-61779',
    required: false,
  })
  businessNumber: string;

  @ApiProperty({
    description: '우편번호',
    example: '13493',
    required: true,
  })
  newCustomerPostIndex: string;

  @ApiProperty({
    description: '주소',
    example: '경기 성남시 분당구 판교로 338',
    required: true,
  })
  newCustomerAddress: string;

  @ApiProperty({
    description: '상세주소',
    example: '301호',
    required: true,
  })
  newCustomerAddressDetail: string;

  @ApiProperty({
    description: '인쇄시안',
    example: '파일경로? 미정',
    required: false,
  })
  printingDraft: string[];

  @ApiProperty({
    description: '납기 희망일',
    example: '2022-06-23',
    required: true,
  })
  desiredDate: string;

  @ApiProperty({
    description: '요청사항',
    example: '인쇄 사이즈, 인쇄 컬러 수, 제작수량 등등',
    required: false,
  })
  requestMemo: string;
}

export class SelectEstimateInfoDto {
  @ApiProperty({
    description: 'sheet id',
    example: '1',
    required: true,
  })
  id: number;

  @ApiProperty({
    description: '만들어진 날짜',
    example: '2022-07-03 23:41:26.401089',
  })
  createdAt: string;

  @ApiProperty({
    description: '수정된 날짜',
    example: '2022-07-03 23:41:26.401089',
  })
  updatedAt: string;

  @ApiProperty({
    description: '삭제된 날짜',
    example: '2022-07-03 23:41:26.401089',
    nullable: true,
  })
  deletedAt: string;

  @ApiProperty({
    description: '대표자 이름',
    example: '이정철',
    required: true,
  })
  estimateName: string;

  @ApiProperty({
    description: '주문 고객 이메일',
    example: 'aa@naver.com',
    required: true,
  })
  estimateEmail: string;

  @ApiProperty({
    description: '연락처',
    example: '01012345678',
    required: true,
  })
  @IsPhoneNumber()
  estimatePhoneNumber: string;

  @ApiProperty({
    description: '업체 상호',
    example: '진솔유통',
    nullable: true,
    required: false,
  })
  estimateBusinessName: string;

  @ApiProperty({
    description: '업태 및 종목',
    example: '이마트',
    nullable: true,
    required: false,
  })
  estimateBusinessType: string;

  @ApiProperty({
    description: '사업자 등록 번호',
    example: '206-34-61779',
    nullable: true,
    required: false,
  })
  estimateBusinessNumber: string;

  @ApiProperty({
    description: '우편번호',
    example: '13493',
    required: true,
  })
  estimatePostIndex: string;

  @ApiProperty({
    description: '주소',
    example: '경기 성남시 분당구 판교로 338',
    required: true,
  })
  estimateAddress: string;

  @ApiProperty({
    description: '상세주소',
    example: '301호',
    required: true,
  })
  estimateAddressDetail: string;

  @ApiProperty({
    description: '인쇄시안',
    example: '파일경로? 미정',
    nullable: true,
    required: false,
  })
  estimatePrintingDraft: string | undefined;

  @ApiProperty({
    description: '납기 희망일',
    example: '2022-06-23',
    required: true,
  })
  estimateDesiredDate: string;

  @ApiProperty({
    description: '요청사항',
    example: '인쇄 사이즈, 인쇄 컬러 수, 제작수량 등등',
    nullable: true,
    required: false,
  })
  estimateRequestMemo: string;

  @ApiProperty({
    description: '고객 번호 [FK]',
    example: 11,
    required: true,
  })
  customerId: number;
}

export class SelectEstimateItemsDto {
  @ApiProperty({
    description: 'sheet id',
    example: '1',
    required: true,
  })
  id: number;

  @ApiProperty({
    description: '만들어진 날짜',
    example: '2022-07-03 23:41:26.401089',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정된 날짜',
    example: '2022-07-03 23:41:26.401089',
  })
  updatedAt: Date;

  @ApiProperty({
    description: '삭제된 날짜',
    example: '2022-07-03 23:41:26.401089',
    nullable: true,
  })
  deletedAt: Date;

  @ApiProperty({
    description: '견적서 번호',
    example: '1',
    required: true,
  })
  estimateSheetId: number;

  @ApiProperty({
    description: '고객 번호',
    example: '11',
    required: true,
  })
  customerId: number;

  @ApiProperty({
    description: '상품 번호',
    example: '111',
    required: true,
  })
  productId: number;

  @ApiProperty({
    description: '상품 수량',
    example: '1000',
    required: true,
  })
  estimateItemEA: number;

  @ApiProperty({
    description: '상품 합계금액',
    example: '1000',
    required: true,
  })
  orderItemTotalPrice: number;

  @ApiProperty({
    description: '프린트 여부',
    example: false,
    required: false,
  })
  isPrint: boolean;

  @ApiProperty({
    description: '상품 이름',
    example: '쭈란 가방',
    required: false,
  })
  productName: string;

  @ApiProperty({
    description: '상품 가격',
    example: 900,
    required: false,
  })
  productPrice: number;

  @ApiProperty({
    description: '상품 이미지 파일 경로',
    example: '/public/images/product/장바구니.jpeg',
    required: true,
  })
  @IsNotEmpty()
  productImageFilepath: string;
}
