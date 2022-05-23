/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Entity,
  Column,
  ManyToOne,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'payment_history' })
class PaymentHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 8, comment: 'Payment 객체의 응답 버전' })
  version: string;

  @Column({
    type: 'varchar',
    length: 256,
    comment: '결제 건에 대한 고유한 키 값',
  })
  @Index()
  paymentKey: string;

  @Column({
    type: 'varchar',
    length: 16,
    comment:
      '결제 타입 정보, [NORMAL(일반 결제), BILLING(자동 결제), CONNECTPAY(커넥트페이)] 중 하나',
  })
  type: string;

  @Column({
    type: 'varchar',
    length: 128,
    comment: '가맹점에서 주문건에 대해 발급한 고유 ID',
  })
  orderId: string;

  @Column({
    type: 'varchar',
    length: 128,
    comment: '결제에 대한 주문명, 1글자 이상 100글자 이하, ex) 생수 외 1건',
  })
  orderName: string;

  @Column({
    type: 'varchar',
    length: 64,
    comment: '가맹점 ID',
  })
  mId: string;

  @Column({
    type: 'varchar',
    length: 8,
    comment: '결제할 때 사용한 통화 단위, KRW만 사용',
  })
  currency: string;

  @Column({
    type: 'varchar',
    length: 32,
    comment:
      '결제할 때 사용한 결제 수단, [카드, 가상계좌, 휴대폰, 계좌이체, 도서문화상품권, 게임문화상품권, 문화상품권] 중 하나',
  })
  method: string;

  @Column({
    type: 'int',
    comment: '총 결제 금액',
  })
  totalAmount: number;

  @Column({
    type: 'int',
    comment: '취소할 수 있는 금액(잔고)',
  })
  balanceAmount: number;

  @Column({
    type: 'varchar',
    length: 32,
    comment:
      '결제 처리 상태, [READY, IN_PROGRESS, WAITING_FOR_DEPOSIT, DONE, CANCELED, PARTIAL_CANCELED, ABORTED, EXPIRED]',
  })
  status: string;

  @Column({
    type: 'datetime',
    comment: '결제 요청이 일어난 날짜와 시간 정보, ISO 8601',
  })
  requestedAt: Date;

  @Column({
    type: 'datetime',
    comment: '결제 승인이 일어난 날짜와 시간 정보, ISO 8601',
  })
  approvedAt: Date;

  @Column({
    type: 'boolean',
    comment: '에스크로 사용 여부',
  })
  useEscrow: boolean;

  @Column({
    type: 'varchar',
    length: 64,
    comment:
      '거래 건에 대한 고유한 키 값, 결제 한 건에 대한 승인 거래와 취소 거래를 구분하는데 사용',
  })
  transactionKey: string;

  @Column({
    type: 'int',
    comment: '공급가액',
  })
  suppliedAmount: number;

  @Column({
    type: 'int',
    comment:
      '부가세, (결제 금액 amount - 면세 금액 taxFreeAmount) / 11 후 소수점 첫째 자리에서 반올림해서 계산',
  })
  vat: number;

  @Column({
    type: 'boolean',
    comment:
      '문화비로 지출했는지 여부 (도서구입, 공연 티켓, 박물관·미술관 입장권 등)',
  })
  cultureExpense: boolean;

  @Column({
    type: 'int',
    comment:
      '전체 결제 금액 중 면세 금액, 값이 0으로 돌아왔다면 전체 결제 금액이 과세 대상',
  })
  taxFreeAmount: number;

  @Column({
    type: 'varchar',
    length: 256,
    comment: '결제 취소 이력이 담기는 배열 (json 문자열)',
    nullable: true,
  })
  cancels: string;

  @Column({
    type: 'boolean',
    comment: '부분 취소 가능 여부, false면 전액 취소만 가능',
  })
  isPartialCancelable: boolean;

  @Column({
    type: 'varchar',
    length: 512,
    comment: '카드로 결제하면 제공되는 카드 관련 정보 (json 문자열)',
    nullable: true,
  })
  card: string;

  @Column({
    type: 'varchar',
    length: 512,
    comment: '가상계좌로 결제하면 제공되는 가상계좌 관련 정보 (json 문자열)',
    nullable: true,
  })
  virtualAccount: string;

  @Column({
    type: 'varchar',
    length: 64,
    comment:
      '가상계좌 웹훅 요청이 정상적인 요청인지 검증하기 위한 값, 이 값이 가상계좌 웹훅 이벤트 본문으로 돌아온 secret과 같으면 정상적인 요청',
    nullable: true,
  })
  secret: string;

  @Column({
    type: 'varchar',
    length: 512,
    comment: '휴대폰으로 결제하면 제공되는 휴대폰 결제 관련 정보 (json 문자열)',
    nullable: true,
  })
  mobilePhone: string;

  @Column({
    type: 'varchar',
    length: 256,
    comment: '상품권으로 결제하면 제공되는 상품권 결제 관련 정보 (json 문자열)',
    nullable: true,
  })
  giftCertificate: string;

  @Column({
    type: 'varchar',
    length: 256,
    comment: '계좌이체로 결제했을 때 이체 정보가 담기는 객체 (json 문자열)',
    nullable: true,
  })
  transfer: string;

  @Column({
    type: 'varchar',
    length: 32,
    comment: '간편결제로 결제한 경우 간편결제 타입 정보',
    nullable: true,
  })
  easyPay: string;

  @Column({
    type: 'varchar',
    length: 8,
    comment: '결제한 국가 정보입니다. ISO-3166의 두 자리 국가 코드 형식',
  })
  country: string;

  @Column({
    type: 'varchar',
    length: 512,
    comment: '결제 실패 정보 (json 문자열)',
    nullable: true,
  })
  failure: string;

  @Column({
    type: 'varchar',
    length: 512,
    comment: '현금영수증 정보 (json 문자열)',
    nullable: true,
  })
  cashReceipt: string;

  @Column({
    type: 'varchar',
    length: 128,
    comment:
      '카드사의 즉시 할인 프로모션 정보, 즉시 할인 프로모션이 적용됐을 때만 생성 (json 문자열)',
    nullable: true,
  })
  discount: string;
}

export default PaymentHistoryEntity;
