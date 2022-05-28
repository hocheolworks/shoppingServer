import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class PaymentHistoryDto {
  @ApiProperty({
    description: 'id',
    example: '1',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Payment 객체의 응답 버전',
    example: '1.4',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  version: string;

  @ApiProperty({
    description: '결제 건에 대한 고유한 키 값',
    example: '5zJ4xY7m0kODnyRpQWGrN2xqGlNvLrKwv1M9ENjbeoPaZdL6',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  paymentKey: string;

  @ApiProperty({
    description:
      '결제 타입 정보, [NORMAL(일반 결제), BILLING(자동 결제), CONNECTPAY(커넥트페이)] 중 하나',
    example: 'NORMAL',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    description: '가맹점에서 주문건에 대해 발급한 고유 ID',
    example: 'a4CWyWY5m89PNh7xJwhk1',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({
    description: '결제에 대한 주문명, 1글자 이상 100글자 이하',
    example: '생수 외 1건',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  orderName: string;

  @ApiProperty({
    description: '가맹점 ID',
    example: 'tosspayments',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  mId: string;

  @ApiProperty({
    description: '결제할 때 사용한 통화 단위, KRW만 사용',
    example: 'KRW',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({
    description: '결제할 때 사용한 결제 수단',
    example: '카드',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  method: string;

  @ApiProperty({
    description: '총 결제 금액',
    example: 15000,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @ApiProperty({
    description: '취소할 수 있는 금액(잔고)',
    example: 15000,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  balanceAmount: number;

  @ApiProperty({
    description: '결제 처리 상태',
    example: 'READY',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({
    description: '결제 요청이 일어난 날짜와 시간 정보, ISO 8601',
    example: '2021-01-01T10:01:30+09:00',
    required: true,
  })
  @IsNotEmpty()
  @IsDate()
  requestedAt: Date;

  @ApiProperty({
    description: '결제 승인이 일어난 날짜와 시간 정보, ISO 8601',
    example: '2021-01-01T10:01:30+09:00',
    required: true,
  })
  @IsNotEmpty()
  @IsDate()
  approvedAt: Date;

  @ApiProperty({
    description: '에스크로 사용 여부',
    example: false,
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  useEscrow: boolean;

  @ApiProperty({
    description:
      '거래 건에 대한 고유한 키 값, 결제 한 건에 대한 승인 거래와 취소 거래를 구분하는데 사용',
    example: 'B7103F204998813B889C77C043D09502',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  transactionKey: string;

  @ApiProperty({
    description: '공급가액',
    example: 13636,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  suppliedAmount: number;

  @ApiProperty({
    description: '부가세',
    example: 1364,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  vat: number;

  @ApiProperty({
    description: '문화비로 지출했는지 여부',
    example: false,
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  cultureExpense: boolean;

  @ApiProperty({
    description:
      '전체 결제 금액 중 면세 금액, 값이 0으로 돌아왔다면 전체 결제 금액이 과세 대상',
    example: 0,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  taxFreeAmount: number;

  @ApiProperty({
    description: '결제 취소 이력이 담기는 배열',
    nullable: true,
  })
  cancels: {
    cancelAmount: number;
    cancelReason: string;
    taxFreeAmount: number;
    taxAmount: number | null;
    refundableAmount: number;
    canceledAt: Date;
  } | null;

  @ApiProperty({
    description: '부분 취소 가능 여부, false면 전액 취소만 가능',
    example: false,
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isPartialCancelable: boolean;

  @ApiProperty({
    description: '카드로 결제하면 제공되는 카드 관련 정보 객체',
    nullable: true,
  })
  card: {
    company: string;
    number: string;
    installmentPlanMonths: number;
    approveNo: string;
    useCardPoint: boolean;
    cardType: string;
    ownerType: string;
    receiptUrl: string;
    acquireStatus: string;
    isInterestFree: boolean;
    interestPayer: string;
  } | null;

  @ApiProperty({
    description: '가상계좌로 결제하면 제공되는 가상계좌 관련 정보 객체',
    nullable: true,
  })
  virtualAccount: {
    accountType: string;
    accountNumber: string;
    bank: string;
    customerName: string;
    dueDate: string;
    refundStatus: string;
    expired: boolean;
    settlementStatus: string;
  } | null;

  @ApiProperty({
    description:
      '가상계좌 웹훅 요청이 정상적인 요청인지 검증하기 위한 값, 이 값이 가상계좌 웹훅 이벤트 본문으로 돌아온 secret과 같으면 정상적인 요청',
    example: 'phhg1H-SkZMJjdnNjZn7F',
    nullable: true,
  })
  @IsNotEmpty()
  @IsString()
  secret: string | null;

  @ApiProperty({
    description: '휴대폰으로 결제하면 제공되는 휴대폰 결제 관련 정보 객체',
    nullable: true,
  })
  mobilePhone: {
    carrier: string;
    customerMobilePhone: string;
    settlementStatus: string;
    receiptUrl: string;
  } | null;

  @ApiProperty({
    description: '상품권으로 결제하면 제공되는 상품권 결제 관련 정보 객체',
    nullable: true,
  })
  giftCertificate: {
    approveNo: string;
    settlementStatus: string;
  } | null;

  @ApiProperty({
    description: '계좌이체로 결제했을 때 이체 정보가 담기는 객체',
    nullable: true,
  })
  transfer: {
    bank: string;
    settlementStatus: string;
  } | null;

  @ApiProperty({
    description: '간편결제로 결제한 경우 간편결제 타입 정보',
    example: '토스결제',
    nullable: true,
  })
  @IsNotEmpty()
  @IsString()
  easyPay: string | null;

  @ApiProperty({
    description: '결제한 국가 정보, ISO-3166의 두 자리 국가 코드 형식',
    example: 'KR',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    description: '결제 실패 정보 객체',
    nullable: true,
  })
  failure: {
    code: string;
    message: string;
  } | null;

  @ApiProperty({
    description: '현금영수증 정보 객체',
    nullable: true,
  })
  cashReceipt: {
    type: string;
    amount: number;
    taxFreeAmount: number;
    issueNumber: string;
    receiptUrl: string;
  } | null;

  @ApiProperty({
    description:
      '카드사의 즉시 할인 프로모션 정보, 즉시 할인 프로모션이 적용됐을 때만 생성',
    nullable: true,
  })
  discount: {
    amount: number;
  } | null;
}
