/* eslint-disable prettier/prettier */
import { cp } from 'fs';
import { CoreEntity } from 'src/common/entities/core.entity';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import OrderItemInfoEntity from './orderItem.entity';

@Entity({ name: 'order_info' })
class OrderInfoEntity extends CoreEntity {
  @Column({ type: 'varchar', length: 16, comment: '주문자 성명' })
  orderCustomerName: string;

  @Column({ type: 'varchar', length: 32, comment: '연락처' })
  orderPhoneNumber: string;

  @Column({ type: 'varchar', length: 16, comment: '우편 번호' })
  orderPostIndex: number;

  @Column({ type: 'varchar', length: 256, comment: '배송 주소' })
  orderAddress: string;

  @Column({ type: 'varchar', length: 256, comment: '상세 주소' })
  orderAddressDetail: string;

  @Column({
    type: 'varchar',
    length: 512,
    comment: '배송 메모(50자 이내)',
    default: '',
  })
  orderMemo: string;

  @Column({ type: 'int', comment: '주문 총 가격' })
  orderTotalPrice: number;

  @Column({ type: 'int', comment: '주문 총 가격 중 상품 총 가격' })
  orderTotalProductsPrice: number;

  @Column({ type: 'int', comment: '주문 총 가격 중 부가세' })
  orderTax: number;

  @Column({ type: 'int', comment: '주문 총 가격 중 인쇄비', default: 0 })
  orderPrintFee: number;

  @Column({ type: 'int', comment: '주문 총 가격 중 배송비', default: 0 })
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

  @Column({ type: 'varchar', length: 128, comment: '토스 결제 주문 ID' })
  orderId: string;

  @Column({ type: 'int', comment: '[FK] 회원 id', nullable: true })
  customerId: number;

  @ManyToOne(() => CustomerInfoEntity, (customer) => customer.orders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  customer: CustomerInfoEntity;

  @OneToMany(() => OrderItemInfoEntity, (orderItem) => orderItem.order)
  orderItems: OrderItemInfoEntity[];

  // @Column({
  //   type: 'varchar',
  //   length: 512,
  //   comment: '디자인 파일',
  //   default: '',
  // })
  // orderDesignFile: string;

  @Column({ type: 'boolean', comment: '세금계산서 여부', default: false })
  isTaxBill: boolean;
}

export default OrderInfoEntity;
