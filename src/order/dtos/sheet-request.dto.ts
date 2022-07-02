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
  businessName : string;
  
  @ApiProperty({
    description: '업태 및 종목',
    example: '이마트',
    required: false,
  })
  businessType : string;
  
  @ApiProperty({
    description: '사업자 등록 번호',
    example: '206-34-61779',
    required: false,
  })
  businessNumber : string;
  
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
  printingDraft : string | undefined;
  
  @ApiProperty({
    description: '납기 희망일',
    example: '2022-06-23',
    required: true,
  })
  desiredDate : string;
  
  @ApiProperty({
    description: '요청사항',
    example: '인쇄 사이즈, 인쇄 컬러 수, 제작수량 등등',
    required: false,
  })
  requestMemo : string;

  @ApiProperty({
    description: '주문한 고객 id, 비회원인 경우 -1',
    example: '11',
    required: true,
  })
  customerId: number;

  @ApiProperty({
    description: '장바구니 상품 목록',
    example: '11',
    required: true,
  })
  orderItems: Array<InputCartItemInfoDto>;
}
