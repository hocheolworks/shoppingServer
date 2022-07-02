/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import OrderItemInfoEntity from './orderItem.entity';

@Entity({ name: 'estimate_info' })
class EstimateSheetEntity extends CoreEntity {
  @Column({ type: 'varchar', length: 16, comment: '대표자 이름'})
  estimateName: string;

  @Column({ type: 'varchar', length: 32, comment: '이메일' })
  estimateEmail: string;

  @Column({ type: 'varchar', length: 32, comment: '연락처' })
  estimatePhoneNumber: string;

  @Column({ type: 'varchar', length: 32, comment: '업체 상호', nullable: true })
  estimateBusinessName: string;

  @Column({ type: 'varchar', length: 32, comment: '업태 및 종목', nullable: true })
  estimateBusinessType: string;

  @Column({ type: 'varchar', length: 32, comment: '업체 상호', nullable: true })
  estimateBusinessNumber: string;

  @Column({ type: 'varchar', length: 16, comment: '우편 번호' })
  estimatePostIndex: string;

  @Column({ type: 'varchar', length: 256, comment: '배송 주소' })
  estimateAddress: string;

  @Column({ type: 'varchar', length: 256, comment: '배송 상세 주소' })
  estimateAddressDetail: string;

  @Column({ type: 'varchar', length: 256, comment: '인쇄시안', nullable: true })
  estimatePrintingDraft: string;

  @Column({ type: 'varchar', length: 256, comment: '납기 희망일' })
  estimateDesiredDate: string;

  @Column({ type: 'varchar', length: 256, comment: '요청사항', nullable: true })
  estimateRequestMemo: string;

  @Column({ type: 'int', comment: '견적 후 가격', nullable: true })
  estimateTotalPrice: number;

  @Column({ type: 'int', comment: '주문 총 가격', nullable: true })
  orderTotalPrice: number;

  @Column({ type: 'int', comment: '주문 총 가격 중 상품 총 가격', nullable: true })
  orderTotalProductsPrice: number;

  @Column({ type: 'int', comment: '주문 총 가격 중 부가세', nullable: true })
  orderTax: number;

  @Column({ type: 'int', comment: '주문 총 가격 중 인쇄비', nullable: true, default: 0 })
  orderPrintFee: number;

  @Column({ type: 'int', comment: '주문 총 가격 중 배송비', nullable: true, default: 0 })
  orderDeliveryFee: number;

  @Column({
    type: 'varchar',
    length: 32,
    comment: '주문 상태',
    default: '결제대기',
  })
  orderStatus: string;

  @Column({ type: 'boolean', comment: '결제 여부', default: false })
  orderIsPaid: boolean;

  @Column({ type: 'varchar', length: 128, comment: '토스 결제 주문 ID', nullable: true })
  orderId: string;

  @Column({ type: 'int', comment: '[FK] 회원 id', nullable: true })
  customerId: number;

  @ManyToOne(() => CustomerInfoEntity, (customer) => customer.orders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  customer: CustomerInfoEntity;

  @Column({ type: 'boolean', comment: '세금계산서 여부', default: false })
  isTaxBill: boolean;

  @Column({
    type: 'int',
    comment: '견적요청 확인여부 0:견적 요청 1:진행중, 2:확인완료, 3:거절',
    default: 0
  })
  requestStatus: number;

  @OneToMany(() => OrderItemInfoEntity, (orderItem) => orderItem.product)
  orderItems: OrderItemInfoEntity[];
}

export default EstimateSheetEntity;
